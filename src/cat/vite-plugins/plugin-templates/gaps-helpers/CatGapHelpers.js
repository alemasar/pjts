const catGapRegExp = /cat-gap="|'(.*)"|'/g
const breaklinesRegExp = /\r?\n|\r|\n/g

const getRoutesValues = (attributes) => {
  let routesIds = []
  const regex = new RegExp(catGapRegExp)
  const catGapSentence = attributes.
    replace(/\s*/g, '').
    split('#').
    filter((gapRoute) => gapRoute.includes('cat-gap='))

  if (catGapSentence.length > 0) {
    routesIds = regex.exec(catGapSentence[0]).
      input.
      replace(/\s/g, '').
      replace('cat-gap=', '').
      replace(/"|'/g, '').
      replace(/^\[/, '').
      replace(/\]+$/, '').
      split(',')
  }

  return routesIds
}

const getGaps = (config, templates) => {
  const gaps = new Map()

  templates.forEach((template) => {
    const tempaltesLines = template.split(breaklinesRegExp)
    const templateLine = tempaltesLines[0]

    if (gaps.has(config.tag) === false) {
      gaps.set(config.tag, new Map())
    }
    if (templateLine.includes('#cat-gap=') === true || templateLine.includes('#cat-gap =') === true) {
      const routesIds = getRoutesValues(templateLine)

      routesIds.forEach((routeId) => {
        gaps.get(config.tag).set(routeId, new Map())
        gaps.get(config.tag).get(routeId).set('gap', tempaltesLines)
      })
    } else if (templateLine.includes('#cat-gap') === true) {
      gaps.get(config.tag).set('index', new Map())
      gaps.get(config.tag).get('index').set('gap', tempaltesLines)
    } else if (templateLine.includes('#import-id') === false) {
      gaps.get(config.tag).set('default', new Map())
      gaps.get(config.tag).get('default').set('template', tempaltesLines)
    }
  })

  return gaps
}

export default getGaps
