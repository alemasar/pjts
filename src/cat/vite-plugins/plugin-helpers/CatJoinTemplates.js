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
            let routeName = {}
            let splittedGaps = []
            const routeMap = new Map()
            defaultGaps.forEach((dg) => {
              splittedGaps = dg.split(breaklinesRegExp)
              if (dg.includes('cat-gap=') === true) {
                const arrayRoutes = splittedGaps[0].
                  replace(`<template cat-gap="`, '').
                  replace('"', '').
                  replace('>', '').
                  replace(/'/g,'"')
                routeName = JSON.parse(`{"routes": ${arrayRoutes}}`)
              }
            })
            routeName.routes.forEach((rn) => {
              console.log(splittedGaps)
              catGaps.set(rn, splittedGaps)
            })
          } else if (defaultGaps !== null && defaultGaps.length > 0) {
            const splittedGaps = template.split(breaklinesRegExp)
            catGaps.set('index', splittedGaps)
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
    } /* else {
      catGaps.set('index', templates[0])
      this.template = generateGap({
        className: config.name + 'Gap',
        tagName: config.tag,
        gaps: template[0],
        parsedGaps: template[0],
      })
    } */
  } 
  parseImportTemplates(line, resultArray, catTemplatesMap) {
    const gapLinePos = line.indexOf('#import')
    if (gapLinePos !== -1) {
      const importId = line.trim().split(' ')[1].replace(/"/g, '')
      resultArray = resultArray.concat(catTemplatesMap.get(importId))
    }
    return resultArray
  }
  parseGaps(gapLinesMap, catTemplatesMap) {
    const resultMap = new Map()
    let resultArray = []
    for (let [key, gapLines] of gapLinesMap.entries()) {
      gapLines.forEach((line) => {
        this.parseImportTemplates(line, resultArray, catTemplatesMap)
      })
      resultMap.set(key, resultArray.join(''))
      resultArray.splice(0)
    }
    return resultMap
  }
}

export default CatJoinTemplates
