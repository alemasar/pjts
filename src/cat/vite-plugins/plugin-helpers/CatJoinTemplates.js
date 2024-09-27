import generateGap from '../plugin-templates/gapTemplate'
const _template = ''
const templateGapRegExp = /<template cat-gap(.|[\s\S])*?<\/template>/g
const breaklinesRegExp = /\r?\n|\r|\n/g
const getRoutesGapRegExp = /cat-gap="(.|[\s\S])*?"/g
class CatJoinTemplates {
  constructor(templates, config) {
    const catTemplates = new Map()
    const catGaps = new Map()
    this.template = ''
    if (templates !== null && templates.length > 0) {
      templates.forEach((template) => {
        if (template !== null && template.length > 0) {
          const routeGaps = template.match(getRoutesGapRegExp)
          const defaultGaps = template.match(templateGapRegExp)
          if (routeGaps !== null) {
            routeGaps.forEach((g) => {
              const parsedGaps = this.parseGaps(template)
              let routeName = 'default'
              if (parsedGaps[0].includes('cat-gap=') === true) {
                routeName = parsedGaps[0].replace(`<template cat-gap="`, '').replace('"', '').replace('>', '')
              }
              console.log('ENTRO', routeName)
              catGaps.set(routeName, parsedGaps.join(''))
            })
          } else if (defaultGaps !== null && defaultGaps.length > 0) {
            console.log('TEMPLATE IN GAP DEFAULT', template)
            const parsedGaps = this.parseGaps(template)
            catGaps.set('default', parsedGaps.join(''))
          } 
        } 
      })
      console.log('ROUTE NAME EN GAPS', catGaps)
      this.template = generateGap({
        className: config.name + 'Gap',
        tagName: config.tag,
        gaps: catGaps,
      })
    } else {
      catGaps.set('default', templates[0])
      this.template = generateGap({
        className: config.name + 'Gap',
        tagName: config.tag,
        gaps: template[0],
      })
    }
    /* if (gaps !== null && gaps.length > 0) {
      const gapsMap = new Map()
      gaps.forEach((t) => {
        let routeName = 'default'
        let routesTag = ''
        const templateGapLines=t.match(getRoutesGapRegExp)
        if (templateGapLines !== null && templateGapLines.length > 0) {
          if (t.includes('cat-gap=') === true) {
            routeName = t.match(getRoutesGapRegExp)[0].replace(`cat-gap="`, '').replace('"', '')
          }
          console.log(routeName)
          gapsMap.set(routeName, t)
        }

          console.log(generateGap({
            className: config.name + 'Gap',
            tagName: config.tag,
            gaps: gapsMap,
          }))
          this.template = generateGap({
            className: config.name + 'Gap',
            tagName: config.tag,
            gaps: gapsMap,
          })
    } else {
      this.template = templates[0]
    }*/
  } 
  parseGaps(template) {
    let gapLines = []
    console.log(template)
    if (Array.isArray(template) === true) {
      template.forEach(gap => {
        gapLines = gap.split(breaklinesRegExp)
        console.log(gapLines)
      })
    } else {
      gapLines = template.split(breaklinesRegExp)
      console.log(gapLines)
    }
    return gapLines
  }
}

export default CatJoinTemplates
