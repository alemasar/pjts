const scriptRegExp = /<script/
const importRegExp = /import-id/
const catGapRegExp = /cat-gap/

const getImportIdsValues = (attributes) => {
  let attributeImportIds = []
  const regex = new RegExp(/import-id="(.*)"/g)
  const catImportIdsSentence = attributes.
    replace(/\s*/g, '').
    split('#').
    filter((gapRoute) => gapRoute.includes('import-id='))
  
  if (catImportIdsSentence.length > 0) {
    attributeImportIds = regex.exec(catImportIdsSentence[0])[1].
      replace(/^\[/, '').
      replace(/"|'/g, '').
      replace(/\]+$/, '').
      split(',')
  }

  return attributeImportIds
}

const getRoutesValues = (attributes) => {
  let routesIds = []
  const regex = new RegExp(/cat-gap="(.*)"/g)
  const catGapSentence = attributes.
    replace(/\s*/g, '').
    split('#').
    filter((gapRoute) => gapRoute.includes('cat-gap='))

  if (catGapSentence.length > 0) {
    routesIds = regex.exec(catGapSentence[0])[1].
      replace(/^\[/, '').
      replace(/"|'/g, '').
      replace(/\]+$/, '').
      split(',')
  }

  return routesIds
}

class CatParseScriptAttributes {
  constructor() {}
  catGap(catGapAttributes, cleanScript) {
    const catGaps = new Map()
    // let codeLine = catGapAttributes.replace('#', '').replace(/\s=\s/g, '=')

    if (catGapAttributes.match(catGapRegExp) !== null) {
      let routesCatGap = getRoutesValues(catGapAttributes)

      if (routesCatGap.length === 0) {
        if (catGaps.has('default') === false) {
          catGaps.set('default', cleanScript)
        }
      } else {
        routesCatGap.forEach((rcg) => {
          const script = [...cleanScript]
          catGaps.set(rcg, script)
        })
      }
    }
    return catGaps
  }

  importScripts(importScriptsAttributes, cleanScript) {
    const importScripts = new Map()
    // let codeLine = importScriptsAttributes.replace(/#/g, '').replace(/\s=\s/g, '=')
    // const importIds = getImportIdsValues(importScriptsAttributes)

    if (importScriptsAttributes.match(importRegExp) !== null) {
      const importIds = getImportIdsValues(importScriptsAttributes)
      if (importIds.length === 0) {
        importScripts.set('default', cleanScript)
      } else {
        importIds.forEach((ii) => {
          let resultScript = [...cleanScript]
          importScripts.set(ii, resultScript)
        })
      }
    }
      
    return importScripts
  }
}

export default CatParseScriptAttributes
