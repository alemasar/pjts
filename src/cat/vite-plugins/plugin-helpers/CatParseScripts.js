const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap="`
const importInstructionName = `#import-id="`

const getScriptRouteImport = (idandroute, parsedScripts, scriptCode) => {
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
      }
      if (importIdTemplate !== '') {
        parsedScripts.get(cro).set(importIdTemplate, scriptCode)
      } else {
        parsedScripts.get(cro).set('default', scriptCode)
      }
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
      scripts.forEach((s) => {
        const splittedScript = s.split(breaklinesRegExp)
        const idandroute = splittedScript[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')

        if (splittedScript[0].match(getCatGapRouteScriptRegExp) !== null && splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          parsedScripts = getScriptRouteImport(idandroute, parsedScripts, splittedScript.join('\n'))
          console.log('parseMultipleScripts after', parsedScripts)
        } else if (splittedScript[0].match(getImportScriptRegExp) !== null) {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          parsedScripts = getScriptImport(idandroute, parsedScripts, splittedScript.join('\n'))
        } else {
          splittedScript[0] = splittedScript[0].replace(splittedScript[0], '<script>')
          parsedScripts = getScriptIndexDefault(parsedScripts, splittedScript.join('\n'))
        }
      })
    }
    return parsedScripts
  }
}

export default CatParseScripts
