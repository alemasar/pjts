import {join} from "path";
import {readFileSync} from 'fs';

const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap="`
const importScriptIdInstructionName = `#import-id="`
const importTemplateInstructionName = `#import `
const requestInstructionName = `#request `
const importJsObj = /{(.|[\s\S])*?}/g
const nodeModulesPath = '/node_modules'

const getIdandRoute = (config, idandroute) => {
  let importIdTemplate = 'default'
  let catGapRoutes = {
    routes: []
  }
  let catRouteObject = {
    routes: []
  }

  idandroute.forEach((ir) => {
    if (ir.match(getCatGapRouteScriptRegExp) !== null) {
      catGapRoutes.routes.push(ir.replace(catGapInstructionName, '').replace('"', '').replace(/'/g,'"'))
    }
    if (ir.match(getImportScriptRegExp) !== null) {
      importIdTemplate = ir.replace(importScriptIdInstructionName, '').replace(`"`, '').replace(importTemplateInstructionName, '').replace(`"`, '')
    }
  })

  if (catGapRoutes.routes.length > 0) {
    catRouteObject = JSON.parse(`{"routes": ${catGapRoutes.routes}}`)
  } else {
    catRouteObject.routes.push('index')
  }
  return {
    tag: config.tag,
    route: catRouteObject.routes,
    id: importIdTemplate,
  }
}

const getScriptRouteImport = (catRouteObject, parsedScripts, scriptCode, defaultScriptCode) => {
  if (catRouteObject.route.length > 0) {
    catRouteObject.route.forEach((cro) => {
      if (parsedScripts.has(cro) === false) {
        parsedScripts.set(cro, new Map())
        parsedScripts.get(cro).set(catRouteObject.id, defaultScriptCode)
      }
      parsedScripts.get(cro).set(catRouteObject.id, scriptCode)
    })
  }
  return parsedScripts
}

const getScriptImport = (catRouteObject, parsedScripts, scriptCode) => {
  const importIdTemplate = catRouteObject.id

  if (parsedScripts.has('index') === false) {
    parsedScripts.set('index', new Map())
  }
  parsedScripts.get('index').set(importIdTemplate, scriptCode)
  return parsedScripts
}

const getScriptIndexDefault = (parsedScripts, scriptCode) => {
  if (parsedScripts.has('index') === false) {
    parsedScripts.set('index', new Map())
  }
  parsedScripts.get('index').set('default', scriptCode)
  return parsedScripts
}

const parseScriptDataImport = (options, jsLine) => {
  const splittedJsLine = jsLine.split('=')
  const variableName = splittedJsLine[0].replace(importTemplateInstructionName, '').trim()
  const fileName = splittedJsLine[1].trim().replace(/"/g, '')
  let parsedJsLine = ''
  let fileContents = readFileSync(join(`src/${options.data.base}/${options.data.path}/${fileName}`),{ encoding: 'utf8', flag: 'r' })

  if (fileName.endsWith('.js') === true) {
    fileContents = fileContents.match(importJsObj)
  }
  parsedJsLine = `  const ${variableName} = JSON.parse(JSON.stringify(${fileContents}))`
  return parsedJsLine
}

const parseScriptDataRequest = (jsLine) => {
  const splittedJsLine = jsLine.split('=')
  const variableName = splittedJsLine[0].replace(requestInstructionName, '').trim()
  const url = splittedJsLine[1].trim()
  const returnObjRequest = {
    variableName,
    importOFetch: `import { ofetch } from "${nodeModulesPath}/ofetch"`,
    makeRequestFunction: [`  const makeRequest = async (url) => {`,
      `    return ofetch(url)`,
      `  }`,
    ],
    request: '',
  }

  returnObjRequest.request = `  const ${variableName} = await makeRequest(${url})`
  return returnObjRequest
}

const addRequestToJs = (returnJs, requestJs) => {
  returnJs.forEach((rjs, index) =>{
    if (rjs.includes(`${requestInstructionName}${requestJs.variableName}=`) === true || rjs.includes(`${requestInstructionName}${requestJs.variableName} =`) === true) {
      returnJs[index] = requestJs.request
    }
  })
  return returnJs
}

const addLoadEvent = (catRouteObject) => {
  return `  const event = new CustomEvent("cat-gap-loaded", { detail: { tag: '${catRouteObject.tag}', route: '${catRouteObject.route}', id: '${catRouteObject.id}' } })`
}

const parseScriptDataImportRequest = (options, jsSplitted, catRouteObject) => {
  let createRequestFunction = false
  let returnJs = jsSplitted
  returnJs.splice(1, 0, addLoadEvent(catRouteObject))
  jsSplitted.forEach((jsLine, index) => {
    if(jsLine.match(importTemplateInstructionName) !== null) {
      const parsedScript = parseScriptDataImport(options, jsLine)
      returnJs[index] = parsedScript
    } 
    if (jsLine.match(requestInstructionName) !== null) {
      const requestJs = parseScriptDataRequest(jsLine)
      if (createRequestFunction === false) {
        returnJs.splice(1, 0, requestJs.importOFetch)
        returnJs.splice(3, 0, ...requestJs.makeRequestFunction)
        returnJs = addRequestToJs(returnJs, requestJs)
        createRequestFunction = true
      } else {
        returnJs = addRequestToJs(returnJs, requestJs)
      }
    }
  })
  return returnJs
}

const deleteComments = (splittedScriptCode) => {
  const cleanCode = []
  let startMultilineComment = false

  splittedScriptCode.forEach((jsLine) => {
    if (jsLine.trim().startsWith('/*') === true) {
      startMultilineComment = true
    } else if (jsLine.trim().startsWith('//') === false && startMultilineComment === false) {
      cleanCode.push(jsLine)
    } else if (jsLine.trim().startsWith('*/') === true) {
      startMultilineComment = false
    }
  })
  return cleanCode
}
const addDispatchEvent = (splittedScript) => {
  splittedScript.push(`  document.dispatchEvent(event)`)
  return splittedScript
}
class CatParseScripts {
  constructor() {}
  parseMultipleScripts(config, options, parsedScripts, scripts) {
    if (scripts.length > 0) {
      let defaultScriptCode = ''
      let scriptCode = ''
      scripts.forEach((s) => {
        const scriptWithOutComments = deleteComments(s.split(breaklinesRegExp))
        const idandroute = scriptWithOutComments[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')
        const catRouteObject = getIdandRoute(config, idandroute)
        let splittedScript = parseScriptDataImportRequest(options, scriptWithOutComments, catRouteObject)

        if (splittedScript[0].match(getCatGapRouteScriptRegExp) === null && splittedScript[0].match(getImportScriptRegExp) === null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          splittedScript = addDispatchEvent(splittedScript)
          defaultScriptCode = splittedScript.join('\n').replace(`<script>`, '').replace(`</script>`, '')
        }
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) !== null && splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          splittedScript = addDispatchEvent(splittedScript)
          scriptCode = splittedScript.join('\n').replace(`<script>`, '').replace(`</script>`, '')
          parsedScripts = getScriptRouteImport(catRouteObject, parsedScripts, scriptCode, defaultScriptCode)
        } else if (splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          splittedScript = addDispatchEvent(splittedScript)
          scriptCode = splittedScript.join('\n').replace(`<script>`, '').replace(`</script>`, '')
          parsedScripts = getScriptIndexDefault(parsedScripts, defaultScriptCode)
          parsedScripts = getScriptImport(catRouteObject, parsedScripts, scriptCode)
        }  else {
          parsedScripts = getScriptIndexDefault(parsedScripts, defaultScriptCode)
        }
      })
    }
    return parsedScripts
  }
}

export default CatParseScripts
