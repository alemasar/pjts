const templateRegExp = /<template/
const importRegExp = /import-id=/
const catGapRegExp = /cat-gap/
const breaklinesRegExp = /\r?\n|\r|\n/g

const getAttributesValues = (regExp, attributes) => {
  return attributes.replace(regExp, '').
        replace(/=/g, '').
          replace(/"|'/g, '').
          replace(/"|'+$/, '').
          replace(/^\[/, '').
          replace(/\]+$/, '').
          split(',')
}

class CatParseTemplatesAttributes {
  constructor() {
    /* const attributes = templateTag.replace(templateRegExp, '').
      replace(/>/, '').
      replace(/^\s/g, '').
      split(breaklinesRegExp)
    console.log('ATTRIBUTES::::::', attributes) */
    /* const tag = config.tag
    const catGaps = templateProperties.catGaps
    const templates = templateProperties.templates
    const attributesTemplate = templateProperties.attributesTemplate
    const attributes = templateTag.replace(templateRegExp, '').
      replace(/>/, '').
      replace(/^\s/g, '').
      split(breaklinesRegExp)

    if (catGaps.has(tag) === false) {
      catGaps.set(tag, new Map())
    }
    if (templates.has(tag) === false) {
      templates.set(tag, new Map())
    }

    attributes.forEach((tt) => {
      let codeLine = tt.replace('#', '').replace(/\s=\s/g, '=')

      if (codeLine.match(catGapRegExp) !== null) {
        let routesCatGap = getAttributesValues(catGapRegExp, codeLine)

        if (routesCatGap[0] === '') {
          routesCatGap[0] = 'default'
        }
        catGaps.get(config.tag).set('cat-gap', new Map())
        catGaps.get(config.tag).get('cat-gap').set('routes', routesCatGap)
      } else if (codeLine.match(importRegExp) !== null) {
        let importTemplateLine = codeLine.replace(importRegExp, '').
          replace(/^"|'/, '').
          replace(/"|'+$/, '').
          split(' #')
        const idTemplate = importTemplateLine.shift()

        templates.get(config.tag).set('idTemplate', idTemplate)
        while(importTemplateLine.length > 0) {
          const attribute = importTemplateLine.shift()
          const attributeSplitted = attribute.split('=')
          const attributeName = attributeSplitted[0]
          const attributeValue = attributeSplitted[1]

          if (attributesTemplate.has(config.tag) === false) {
            attributesTemplate.set(config.tag, new Map())
            if (attributesTemplate.get(config.tag).has(idTemplate) === false) {
              attributesTemplate.get(config.tag).set(idTemplate, new Map())
            }
          }
          attributesTemplate.get(config.tag).get(idTemplate).set(attributeName, attributeValue)
        }
      }
    })

    return {
      catGaps,
      templates,
      attributesTemplate,
    }*/
  }
  catGap(catGapattributes, cleanTemplate) {
    const catGaps = new Map()
    let codeLine = catGapattributes.replace('#', '').replace(/\s=\s/g, '=')

    if (codeLine.match(catGapRegExp) !== null) {
      let routesCatGap = getAttributesValues(catGapRegExp, codeLine)

      if (routesCatGap[0] === '') {
        if (catGaps.has('default') === false) {
          catGaps.set('default', cleanTemplate)
        }
      } else {
        console.log(codeLine)
        routesCatGap.forEach((rcg) => {
          const route = rcg.replace(/\s/g, '')
          const templateTag = cleanTemplate.shift().replace(codeLine, `cat-gap="${route}"`)
          console.log(templateTag.replace(codeLine, `cat-gap="${route}"`))
          cleanTemplate.unshift(templateTag)

          catGaps.set(route, cleanTemplate)
        })
      }
    }
    return catGaps
  }
}

export default CatParseTemplatesAttributes
