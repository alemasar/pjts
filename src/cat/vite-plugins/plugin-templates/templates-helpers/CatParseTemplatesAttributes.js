const templateRegExp = /<template/
const importRegExp = /import-id/
const catGapRegExp = /cat-gap/

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

const getImportIdsValues = (regExp, attributes) => {
  const attributesArray = attributes.split(' #')
  let returnImportId = ''

  attributesArray.forEach((aa) => {
    if (aa.includes('import-id') === true) {
      returnImportId = aa.replace(regExp, '').
        replace(/=/g, '').
        replace(/"|'/g, '').
        replace(/"|'+$/, '')
    }
  })
  return returnImportId
}

class CatParseTemplatesAttributes {
  constructor() {}

  catGap(catGapAttributes, cleanTemplate) {
    const catGaps = new Map()
    let codeLine = catGapAttributes.replace('#', '').replace(/\s=\s/g, '=')

    if (codeLine.match(catGapRegExp) !== null) {
      let routesCatGap = getRoutesValues(catGapRegExp, codeLine)

      if (routesCatGap[0] === '') {
        if (catGaps.has('default') === false) {
          catGaps.set('default', cleanTemplate)
        }
      } else {
        routesCatGap.forEach((rcg) => {
          const template = [...cleanTemplate]
          const route = rcg.replace(/\s/g, '')
          const templateTag = template.shift()
          const catGapAttribute = templateTag.
            replace('<template ', '').
            split(' #').
            filter((cg) => cg.includes('#cat-gap'))[0]

          template.unshift(templateTag.replace(catGapAttribute, `#cat-gap="${route}"`))
          catGaps.set(route, template)
        })
      }
    }
    return catGaps
  }

  importTemplates(importTemplatesAttributes, cleanTemplate) {
    const template = [...cleanTemplate]
    const importTemplates = new Map()
    let codeLine = importTemplatesAttributes.replace('#', '').replace(/\s=\s/g, '=')

    if (codeLine.match(catGapRegExp) === null) {
      let importIds = getImportIdsValues(importRegExp, codeLine)

      if (importIds === '') {
        importIds = 'default'
      }
      importTemplates.set(importIds, template)
    }
    return importTemplates
  }
}

export default CatParseTemplatesAttributes
