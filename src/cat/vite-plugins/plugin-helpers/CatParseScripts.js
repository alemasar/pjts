const breaklinesRegExp = /\r?\n|\r|\n/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap="`
const importInstructionName = `#import-id="`

class CatParseScripts {
  constructor() {}
  parseMultipleScripts(scripts) {
    const parsedScripts = new Map()
    if (scripts.length > 0) {
      scripts.forEach((s) => {
        const splittedScript = s.split(breaklinesRegExp)
        const scriptCode = splittedScript.join('\n')
        const idandroute = splittedScript[0].replace(`<script`, '').replace(`>`, '').trim().split(' ')
        if (splittedScript[0].match(getCatGapRouteScriptRegExp) !== null && splittedScript[0].match(getImportScriptRegExp) !== null) {
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
          console.log(typeof catRouteObject)
          if (catRouteObject.routes.length > 0) {
            catRouteObject.routes.forEach((cro) => {
              parsedScripts.set(cro, new Map())
              if (importIdTemplate !== '') {
                parsedScripts.get(cro).set(importIdTemplate, scriptCode)
              } else {
                parsedScripts.get(cro).set('default', scriptCode)
              }
            })
          }
        } else if (splittedScript[0].match(getImportScriptRegExp) !== null) {
          const importIdTemplate = idandroute[0].replace(importInstructionName, '').replace(`"`, '')
          parsedScripts.set('index', new Map())
          parsedScripts.get('index').set(importIdTemplate, scriptCode)
        } else {
          parsedScripts.set('index', new Map())
          parsedScripts.get('index').set('default', scriptCode)
        }
      })
      console.log('CATPARSESCRIPTS::::', parsedScripts)
    }
    return parsedScripts
  }
}

export default CatParseScripts
