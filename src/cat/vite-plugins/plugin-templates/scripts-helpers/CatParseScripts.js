import {join} from "path";
import {readFileSync} from 'fs';
import catParseScriptAttributes from "./CatParseScriptAttributes"

const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getCatGapSentenceScriptRegExp = /#cat-gap/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap"`
const importScriptIdInstructionName = `#import-id"`
const importTemplateInstructionName = `#import `
const requestInstructionName = `#request `
const importJsObj = /{(.|[\s\S])*?}/g
const nodeModulesPath = '/node_modules'

const addLoadEvent = (catRouteObject) => {
  return `  const event = new CustomEvent("cat-gap-loaded", { detail: { tag: '${catRouteObject.tag}', route: '${catRouteObject.route}', id: '${catRouteObject.id}' } })`
}

const addDispatchEvent = (splittedScript) => {
  splittedScript.push(`  document.dispatchEvent(event)`)
  return splittedScript
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

const getIdandRoute = (config, idandroute) => {
  let importIdTemplate = ''
  let catGapRoutes = {
    routes: []
  }
  let catRouteObject = {
    routes: []
  }
  if (idandroute.length > 1) {
    console.log(idandroute)
    // idandroute.forEach((ir) => {
      const sentenceType = idandroute.shift().trim()
      const sentenceValue = idandroute.shift().trim()
      console.log('SENTENCE TYPE:::::', sentenceType)
      console.log('SENTENCE VALUE:::::', sentenceValue)
      if (sentenceType.match(getCatGapSentenceScriptRegExp) !== null) {
        const valueArray = sentenceValue.replace(/"/g, '').replace(/\[/,'').replace(/\]/, '').split(',')
        valueArray.forEach((va) => {
          catGapRoutes.routes.push(va.replace(/'/g, '').trim())
        })
        console.log(sentenceValue.replace(/"/g, '').replace(/\[/,'').replace(/\]/, '').split(','))
        // catGapRoutes.routes.push()
      }

      if (sentenceType.match(getImportScriptRegExp) !== null) {
        importIdTemplate = sentenceValue.replace(importScriptIdInstructionName, '').replace(`"`, '').replace(importTemplateInstructionName, '').replace(`"`, '')
      }
    // })
  } /* else if (idandroute.length > 1) {
    /* if (sentenceType.match(getImportScriptRegExp) !== null) {
      importIdTemplate = sentenceValue.replace(importScriptIdInstructionName, '').replace(`"`, '').replace(importTemplateInstructionName, '').replace(`"`, '')
    }
  } */
  console.log(catGapRoutes.routes)
  if (importIdTemplate !== '') {
    catRouteObject.routes.push('index')
  }
  console.log('CatGapRoutes::::', catGapRoutes.routes)
  
  return {
    tag: config.tag,
    routes: catRouteObject.routes,
    id: importIdTemplate,
  }
}

const getFileImport = (options, line) => {
  const importElements = line.replace(importTemplateInstructionName, '').split('=')
  const fileName = importElements[1].replace(/"/g, '').trim()
  let fileContents = readFileSync(join(`src/${options.data.base}/${options.data.path}/${fileName}`),{ encoding: 'utf8', flag: 'r' })
  let fileContentsString = ''

  if (fileName.endsWith('.js') === true) {
    fileContentsString = fileContents.match(importJsObj)[0].replace(breaklinesRegExp, '\n')
  } else {
    fileContentsString = JSON.stringify(fileContents).replace(/\\r/g, '')
  }

  return `  const ${importElements[0].trim()} = JSON.parse(${fileContentsString})`
}

const getRequestImportObject = (line)  => {
  const splittedJsLine = line.split('=')
  const variableName = splittedJsLine[0].replace(requestInstructionName, '').trim()
  const url = splittedJsLine[1].trim()
  const returnObjRequest = {
    variableName,
    importOFetch: `import { ofetch } from "${nodeModulesPath}/ofetch"`,
    makeRequestFunction: [`  const makeRequest = async (url) => {`,
      `    return ofetch(url)`,
      `  }`,
    ],
    request: `  const ${variableName} = await makeRequest(${url})`,
  }
  return returnObjRequest
}

const parseScriptCode = (scriptWithOutComments, options) => {
  const scriptCode = scriptWithOutComments
  let addedImportOfecth = false

  scriptWithOutComments.forEach((line, index) => {
    if (line.match(importTemplateInstructionName) !== null) {
      const parsedJsLine = getFileImport(options, line)
      scriptCode[index] = parsedJsLine
    } else if (line.match(requestInstructionName) !== null) {
      const returnObjRequest = getRequestImportObject(line)
      if (addedImportOfecth === false) {
        scriptCode[0] = returnObjRequest.request
        scriptCode.splice(0, 0, returnObjRequest.importOFetch)
        scriptCode.splice(1, 0, ...returnObjRequest.makeRequestFunction)
        addedImportOfecth = true
      } else {
        scriptCode[index] = returnObjRequest.request
      }
    }
  })
  return scriptCode.join('\n')
}

class CatParseScripts {
  constructor() {}
  getScriptCode(scriptWithOutComments, options) {
    let scriptCode = ''

    scriptWithOutComments.pop()
    scriptWithOutComments.shift()
    scriptCode = parseScriptCode(scriptWithOutComments, options)
    return scriptCode
  }

  parseScript(config, options, parsedScripts, script) {
    const scriptWithOutComments = deleteComments(script.split(breaklinesRegExp))
    const idandroutes = scriptWithOutComments[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')
    /* const catRouteObject = getIdandRoute(config, idandroutes)
    let scriptCode = ''

    scriptCode = this.getScriptCode(scriptWithOutComments, options)
    if (catRouteObject.routes.length > 0){
      catRouteObject.routes.forEach((crrs) => {
        let idMapCode = new Map()
        if (parsedScripts.get(config.tag).has(crrs) === true) {
          idMapCode = parsedScripts.get(config.tag).get(crrs)
        }
        idMapCode.set(catRouteObject.id, scriptCode)
        parsedScripts.get(config.tag).set(crrs, idMapCode)
      })
    } */
    return parsedScripts
  }
  parseMultipleScripts(config, options, parsedScripts, scripts) {
    if (scripts.length > 0) {
      const tagName = config.tag
      const defaultScript = new Map()
      let defaultScriptCode = new Map()
      parsedScripts.set(tagName, new Map())
      defaultScript.set(tagName, new Map())
      defaultScriptCode.set(tagName, new Map())
      scripts.forEach((s) => {
        const scriptWithOutComments = deleteComments(s.split(breaklinesRegExp))
        const idandroutes = new catParseScriptAttributes(scriptWithOutComments[0])
        console.log(idandroutes.getRoutes())
        /* const catRouteObject = getIdandRoute(config, idandroutes)

        console.log('ROUTESSSS', catRouteObject)

        if (catRouteObject.id === '' && catRouteObject.routes.length === 0) {
          defaultScriptCode.get(tagName).set('default', this.getScriptCode(scriptWithOutComments, options))
        } else if (catRouteObject.id === '' && catRouteObject.routes.length > 0) {
          catRouteObject.routes.forEach((cro) => {
            if (cro.length > 0) {
              defaultScriptCode.get(tagName).set(cro, this.getScriptCode(scriptWithOutComments, options))
            }
          })
        } */
      })
      /* console.log(defaultScriptCode)
      if (defaultScriptCode.has(config.tag) === true) {
        defaultScriptCode.get(config.tag).forEach((cro) => {
          if (cro.length > 0) {
            defaultScript.get(config.tag).set(cro, defaultScriptCode)
          }
        })
      }

      scripts.forEach((s) => {
        parsedScripts = this.parseScript(config, options, parsedScripts, s)
        console.log('PARSED SCRIPTS:::::', parsedScripts)
      }) */
    }
    return parsedScripts
  }
}

export default CatParseScripts
