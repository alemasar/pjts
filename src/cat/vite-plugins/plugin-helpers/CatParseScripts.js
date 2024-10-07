const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap="`
const importInstructionName = `#import-id="`

const getScriptRouteImport = (idandroute, parsedScripts, scriptCode, defaultScriptCode) => {
  let catGapRoutes = ''
  let importIdTemplate = ''
  let catRouteObject = {}

  idandroute.forEach((ir) => {
    if (ir.match(getCatGapRouteScriptRegExp) !== null) {
      catGapRoutes = ir.replace(catGapInstructionName, '').replace('"', '').replace(/'/g,'"')
    }
    if (ir.match(getImportScriptRegExp) !== null) {
      importIdTemplate = ir.replace(importInstructionName, '').replace(`"`, '')
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
  const importIdTemplate = idandroute[0].replace(importInstructionName, '').replace(`"`, '')
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

class CatParseScripts {
  constructor() {}
  parseMultipleScripts(parsedScripts, scripts) {
    if (scripts.length > 0) {
      let defaultScriptCode = ''
      let scriptCode = ''
      scripts.forEach((s) => {
        const splittedScript = s.split(breaklinesRegExp)
        const idandroute = splittedScript[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) === null && splittedScript[0].match(getImportScriptRegExp) === null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          defaultScriptCode = splittedScript.join('\n')
        }
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) !== null && splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          console.log('ID AND ROUTE', idandroute)
          scriptCode = splittedScript.join('\n')
          parsedScripts = getScriptRouteImport(idandroute, parsedScripts, scriptCode, defaultScriptCode)
          // console.log('parseMultipleScripts after', parsedScripts)
        } else if (splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          scriptCode = splittedScript.join('\n')
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
