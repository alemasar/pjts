import {join} from "path";
import {readFileSync} from 'fs';
import CatParseScriptAttributes from "./CatParseScriptAttributes"

const breaklinesRegExp = /\r?\n|\r|\n/g
const scriptRegExp = /<script/
const removeBlankSpaces = /^\s*/g
const getCatGapRouteScriptRegExp = /#cat-gap="(.|[\s\S])*?"/g
const getCatGapSentenceScriptRegExp = /#cat-gap/g
const getImportScriptRegExp = /#import-id="(.|[\s\S])*?"/g
const catGapInstructionName = `#cat-gap"`
const importScriptIdInstructionName = `#import-id"`
const importTemplateInstructionName = `#import `
const requestInstructionName = `#request `
const importJsObj = /{(.|[\s\S])*?}/g
const nodeModulesPath = '/node_modules'

/* const addLoadEvent = (catRouteObject) => {
  return `  const event = new CustomEvent("cat-gap-loaded", { detail: { tag: '${catRouteObject.tag}', route: '${catRouteObject.route}', id: '${catRouteObject.id}' } })`
}

const addDispatchEvent = (splittedScript) => {
  splittedScript.push(`  document.dispatchEvent(event)`)
  return splittedScript
} */
const simpleComment = (jsLine) => {
  let posComment = jsLine.indexOf('//')
  let cleanLine = ''

  while (posComment !== -1) {    
    cleanLine += jsLine.substring(0, posComment)
    if (cleanLine.endsWith('https:') === true || cleanLine.endsWith('http:') === true) {
      const lastPosComment = posComment
      posComment = jsLine.indexOf('//', posComment + 3)
      if (posComment === -1) {
        cleanLine += jsLine.substring(lastPosComment, jsLine.length - 1)
      }
    } else {
      posComment = jsLine.indexOf('//', posComment + 1)
    }
  }

  return cleanLine
}

const multilineComments = (jsLine) => {
  let posComment = jsLine.indexOf('/*')
  let lastPosComment = 0
  let cleanLine =  ''

  while (posComment !== -1) {
    cleanLine += jsLine.substring(lastPosComment, posComment)
    lastPosComment = jsLine.indexOf('*/', posComment + 1)
    posComment = jsLine.indexOf('/*', lastPosComment + 1)
  }
  cleanLine += jsLine.substring(lastPosComment + 2, jsLine.length)

  return cleanLine
}

const commentsAtLine = (jsLine) => {
  let cleanLine = jsLine
  if (jsLine.includes('//') === true) {
    cleanLine = simpleComment(jsLine)
  } else if (jsLine.includes('/*') === true && jsLine.includes('*/') === true) {
    cleanLine = multilineComments(jsLine)
  }
  return cleanLine.replace(/\s*$/g, '')
}

const deleteComments = (jsLines) => {
  const cleanCode = []
  let startMultilineComment = false
  jsLines.forEach((jsLine) => {
    const line = jsLine.replace(removeBlankSpaces, '')
    if (line.startsWith('/*') === true) {
      startMultilineComment = true
    } else if (line.startsWith('//') === false && startMultilineComment === false) {
      const addLine = commentsAtLine(line)
      cleanCode.push(addLine)
    } else if (line.startsWith('*/') === true) {
      startMultilineComment = false
    }
  })
  return cleanCode
}


class CatParseScripts {
  constructor() {
    this.catParseScriptAttributes = new CatParseScriptAttributes()
  }

  setGaps(scriptLine, catGaps, cleanScript) {
    const gaps = this.catParseScriptAttributes.catGap(scriptLine, cleanScript)
    const catGap = catGaps

    for (let [key, gap] of gaps.entries()) {
      catGap.set(key, gap)
    }
  }

  setImportScripts(scriptLine, importScripts, cleanScript) {
    const importIdsScripts = this.catParseScriptAttributes.importScripts(scriptLine, cleanScript)

    for (let [key, script] of importIdsScripts.entries()) {
      let resultScript = [...script]
      if (importScripts.has(key) === true) {
        importScripts.get(key).push(...resultScript)
      } else {
        importScripts.set(key, resultScript)
      }
    }
  }

  getGapsAndScripts(config, scriptsArray) {
    let catGaps = new Map()
    let importScripts = new Map()

    scriptsArray.forEach((script) => {
      const cleanScript = deleteComments(script.split(breaklinesRegExp))
      const scriptLine = cleanScript[0].replace(scriptRegExp, '').
        replace(/>/, '')
        if (scriptLine.includes('#cat-gap') === true) {
          if (catGaps.has(config.tag) === false) {
            catGaps.set(config.tag, new Map())
          }
          this.setGaps(scriptLine, catGaps.get(config.tag), cleanScript)
        } 
    })
        /* if (scriptLine.includes('#import-id') === true) {
          if (importScripts.has(config.tag) === false) {
            importScripts.set(config.tag, new Map())
          }
          this.setImportScripts(scriptLine, importScripts.get(config.tag), cleanScript)
        } */
    console.log('CAT GAPS:::::', catGaps)
    console.log('IMPORT SCRIPTS:::::', importScripts)
    return {
      catGaps,
      importScripts,
    }
  }




  getScriptCode(scriptWithOutComments, options) {
    let scriptCode = ''

    /* scriptWithOutComments.pop()
    scriptWithOutComments.shift()
    scriptCode = parseScriptCode(scriptWithOutComments, options) */
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
        const idandroutes = new CatParseScriptAttributes(scriptWithOutComments[0])
        const catRouteObject = idandroutes.getRoutes(config)
        // console.log('Cat Route Object', catRouteObject)
        
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
