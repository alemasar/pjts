import {join} from "path";
import {readFileSync} from 'fs';

const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap="`
const importIdInstructionName = `#import-id="`
const importInstructionName = `#import `
const requestInstructionName = `#request="`

const getScriptRouteImport = (idandroute, parsedScripts, scriptCode, defaultScriptCode) => {
  let catGapRoutes = ''
  let importIdTemplate = ''
  let catRouteObject = {}

  idandroute.forEach((ir) => {
    if (ir.match(getCatGapRouteScriptRegExp) !== null) {
      catGapRoutes = ir.replace(catGapInstructionName, '').replace('"', '').replace(/'/g,'"')
    }
    if (ir.match(getImportScriptRegExp) !== null) {
      importIdTemplate = ir.replace(importIdInstructionName, '').replace(`"`, '')
    }
  })
  catRouteObject = JSON.parse(`{"routes": ${catGapRoutes}}`)
  if (catRouteObject.routes.length > 0) {
    catRouteObject.routes.forEach((cro) => {
      if (parsedScripts.has(cro) === false) {
        parsedScripts.set(cro, new Map())
        parsedScripts.get(cro).set('default', defaultScriptCode)
      }
      parsedScripts.get(cro).set(importIdTemplate, scriptCode)
    })
  }
  return parsedScripts
}

const getScriptImport = (idandroute, parsedScripts, scriptCode) => {
  const importIdTemplate = idandroute[0].replace(importIdInstructionName, '').replace(`"`, '')
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

const parseScriptDataImport = (config, jsLine) => {
  let parsedJsLine = ''
  const splittedJsLine = jsLine.split('=')
  const variableName = splittedJsLine[0].replace(importInstructionName, '').trim()
  const fileName = splittedJsLine[1].trim().replace(/"/g, '')
  const obj = readFileSync(join(`src/${config.data.base}/${config.data.path}/${fileName}`),{ encoding: 'utf8', flag: 'r' })
  parsedJsLine = `const ${variableName} = JSON.parse(JSON.stringify(${obj}))`
  return parsedJsLine
}

const parseScriptDataImportRequest = (config, jsSplitted) => {
  console.log('IMPORT OBJECT', jsSplitted)
  jsSplitted.forEach((jsLine, index) => {
    if(jsLine.match(importInstructionName) !== null) {
      const parsedScript = parseScriptDataImport(config, jsLine)
      jsSplitted[index] = parsedScript
    }
  })
  return jsSplitted
}

class CatParseScripts {
  constructor() {}
  parseMultipleScripts(config, parsedScripts, scripts) {
    if (scripts.length > 0) {
      let defaultScriptCode = ''
      let scriptCode = ''
      scripts.forEach((s) => {
        const splittedScript = parseScriptDataImportRequest(config, s.split(breaklinesRegExp))
        const idandroute = splittedScript[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) === null && splittedScript[0].match(getImportScriptRegExp) === null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          defaultScriptCode = splittedScript.join('\n').replace('<script>', '').replace('</script>', '')
        }
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) !== null && splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          scriptCode = splittedScript.join('\n').replace('<script>', '').replace('</script>', '')
          parsedScripts = getScriptRouteImport(idandroute, parsedScripts, scriptCode, defaultScriptCode)
        } else if (splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          scriptCode = splittedScript.join('\n').replace('<script>', '').replace('</script>', '')
          parsedScripts = getScriptIndexDefault(parsedScripts, defaultScriptCode)
          parsedScripts = getScriptImport(idandroute, parsedScripts, scriptCode)
        }  else {
          parsedScripts = getScriptIndexDefault(parsedScripts, defaultScriptCode)
        }
      })
    }
    return parsedScripts
  }
}

export default CatParseScripts
