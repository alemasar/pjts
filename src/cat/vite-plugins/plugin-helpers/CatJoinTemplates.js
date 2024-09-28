import generateGap from '../plugin-templates/gapTemplate'
const _template = ''
const templateGapRegExp = /<template cat-gap(.|[\s\S])*?<\/template>/g
const templateImportRegExp = /<template #import-id(.|[\s\S])*?<\/template>/g
const breaklinesRegExp = /\r?\n|\r|\n/g
const getRoutesGapRegExp = /cat-gap="(.|[\s\S])*?"/g
const getImportGapRegExp = /#import-id="(.|[\s\S])*?"/g
const getRequestGapRegExp = /#request "(.|[\s\S])*?"/g
const getImportTemplateRegExp = /#import "(.|[\s\S])*?"/g

class CatJoinTemplates {
  constructor(templates, config) {
    const catTemplates = new Map()
    const catGaps = new Map()
    let parsedGaps = new Map()
    this.template = ''
    if (templates !== null && templates.length > 0) {
      templates.forEach((template) => {
        if (template !== null && template.length > 0) {
          const importTemplate = template.match(templateImportRegExp)
          const routeGaps = template.match(getRoutesGapRegExp)
          const defaultGaps = template.match(templateGapRegExp)
          if (importTemplate !== null) {
            importTemplate.forEach((it) => {
              const parsedImportTemplates = it.split(breaklinesRegExp)
              const importId = it.match(getImportGapRegExp)[0].trim().split(/=/g)[1].replace(/"/g, '')
              catTemplates.set(importId, parsedImportTemplates)
            })
          }
          if (routeGaps !== null) {
            let routeName = 'default'
            defaultGaps.forEach((dg) => {
              const parsedGaps = dg.split(breaklinesRegExp)
              if (dg.includes('cat-gap=') === true) {
                const arrayRoutes = parsedGaps[0].
                  replace(`<template cat-gap="`, '').
                  replace('"', '').
                  replace('>', '').
                  replace(/'/g,'"')
                routeName = JSON.parse(`{"routes": ${arrayRoutes}}`)
              }
            })
            routeName.routes.forEach((rn) => {
              catGaps.set(rn, parsedGaps)
            })
          } else if (defaultGaps !== null && defaultGaps.length > 0) {
            const parsedGaps = template.split(breaklinesRegExp)
            catGaps.set('default', parsedGaps)
          }
        }
      })
      parsedGaps = this.parseGaps(catGaps, catTemplates)
      this.template = generateGap({
        className: config.name + 'Gap',
        tagName: config.tag,
        gaps: catGaps,
        parsedGaps, 
      })
    } else {
      catGaps.set('default', templates[0])
      this.template = generateGap({
        className: config.name + 'Gap',
        tagName: config.tag,
        gaps: template[0],
        parsedGaps: template[0],
      })
    }
  } 
  parseImportTemplates(lines) {

  }
  parseGaps(gapLinesMap, catTemplatesMap) {
    const resultMap = new Map()
    let resultArray = []
    for (let [key, gapLines] of gapLinesMap.entries()) {
      gapLines.forEach((l) => {
        const gapLinePos = l.indexOf('#import')
        if (gapLinePos !== -1) {
          const importId = l.trim().split(' ')[1].replace(/"/g, '')
          resultArray = resultArray.concat(catTemplatesMap.get(importId))
        }
      })
      console.log('RESULT ARRAY::::::', resultArray)
      resultMap.set(key, resultArray.join(''))
    }
    return resultMap
  }
}

export default CatJoinTemplates
