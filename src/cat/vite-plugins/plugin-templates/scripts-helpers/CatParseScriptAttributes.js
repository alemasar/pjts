const scriptRegExp = /<script/
const importRegExp = /import-id/
const catGapRegExp = /cat-gap/

/* const getAttributesValues = (regExp, attributes) => {
  return attributes.replace(regExp, '').
          replace(/"|'/g, '').
          replace(/"|'+$/, '').
          replace(/^\[/, '').
          replace(/\]+$/, '').
          split(',')
} */

const getImportIdsValues = (regExp, attributes) => {
  const attributesArray = attributes.split(' #')
  let returnImportId = ''

  attributesArray.forEach((aa) => {
    if (aa.includes('import-id') === true) {
      returnImportId = aa.replace(regExp, '').
        replace(/=/g, '').
        replace(/"|'/g, '').
        replace(/"|'+$/, '').
        replace(/^\[/, '').
        replace(/\]+$/, '').
        replace(/\s/g, '').
        split(',')
    }
  })
  return returnImportId
}

const getRoutesValues = (regExp, attributes) => {
  const attributesArray = attributes.split(' #')
  let returnRoute = []

  attributesArray.forEach((aa) => {
    if (aa.includes('cat-gap') === true) {
      returnRoute = aa.replace(regExp, '').
        replace(/=/g, '').
        replace(/"|'/g, '').
        replace(/"|'+$/, '').
        replace(/^\[/, '').
        replace(/\]+$/, '').
        split(',')
    }
  })
  return returnRoute
}

class CatParseScriptAttributes {
  constructor() {}
  catGap(catGapAttributes, cleanScript) {
    const catGaps = new Map()
    let codeLine = catGapAttributes.replace('#', '').replace(/\s=\s/g, '=')

    if (codeLine.match(catGapRegExp) !== null) {
      let routesCatGap = getRoutesValues(catGapRegExp, codeLine)

      if (routesCatGap[0] === '') {
        if (catGaps.has('default') === false) {
          catGaps.set('default', cleanScript)
        }
      } else {
        routesCatGap.forEach((rcg) => {
          const script = [...cleanScript]
          const route = rcg.replace(/\s/g, '')
          const scriptTag = script.shift()
          const catGapAttribute = scriptTag.
            replace('<script ', '').
            split(' #').
            filter((cg) => cg.includes('#cat-gap'))[0]

          script.unshift(scriptTag.replace(catGapAttribute, `#cat-gap="${route}"`))
          catGaps.set(route, script)
        })
      }
    }
    return catGaps
  }

  importScripts(importScriptsAttributes, cleanScript) {
    const script = [...cleanScript]
    const importScripts = new Map()
    let codeLine = importScriptsAttributes.replace('#', '').replace(/\s=\s/g, '=')

    if (codeLine.match(catGapRegExp) === null) {
      const importIds = getImportIdsValues(importRegExp, codeLine)
      
      if (importIds.length === 0) {
        importScripts.set('default', script)
      } else {
        importIds.forEach((ii) => {
          importScripts.set(ii, script)
        })
      }
    }
    return importScripts
  }
}

export default CatParseScriptAttributes
