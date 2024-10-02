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
  constructor(templates, config, scripts) {
    this.parsedGaps = new Map()
    this.catGaps = new Map()
    this.template = ''
    this.catTemplates = new Map()

    if (templates !== null && templates.length > 1) {
      this.parseMultipleTemplates(templates)
    } else if (templates !== null) {
      const splittedGaps = templates[0].split(breaklinesRegExp)
      this.catGaps.set('default', splittedGaps.join(''))
      this.parsedGaps = this.catGaps
    }
    this.template = generateGap({
      className: config.name + 'Gap',
      tagName: config.tag,
      parsedGaps: this.parsedGaps,
    })
  }
  parseMultipleTemplates(templates) {
    templates.forEach((template) => {
      if (template !== null && template.length > 0) {
        const importTemplates = template.match(templateImportRegExp)
        const routeGaps = template.match(getRoutesGapRegExp)
        const defaultGaps = template.match(templateGapRegExp)
        if (importTemplates !== null) {
          this.parseTemplates(importTemplates)
        }
        if (routeGaps !== null) {
          this.parseRouteGaps(defaultGaps)
        } else if (defaultGaps !== null && defaultGaps.length > 0) {
          const splittedGaps = template.split(breaklinesRegExp)
          this.catGaps.set('index', splittedGaps)
        }
      }
    })
    this.parsedGaps = this.parseGaps(this.catGaps)
  }
  parseTemplates(importTemplates) {
    importTemplates.forEach((it) => {
      const parsedImportTemplates = it.split(breaklinesRegExp)
      const importId = it.match(getImportGapRegExp)[0].trim().split(/=/g)[1].replace(/"/g, '')
      this.catTemplates.set(importId, parsedImportTemplates)
    })
  }
  parseImportTemplates(line, resultArray) {
    const gapLinePos = line.indexOf('#import')
    if (gapLinePos !== -1) {
      const importId = line.trim().split(' ')[1].replace(/"/g, '')
      resultArray = resultArray.concat(this.catTemplates.get(importId))
    }
    return resultArray
  }
  parseRouteGaps(defaultGaps) {
    let routeName = {}
    let splittedGaps = []
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
      this.catGaps.set(rn, splittedGaps)
    })  
  }
  parseGaps(gapLinesMap) {
    const resultMap = new Map()
    let resultArray = []
    for (let [key, gapLines] of gapLinesMap.entries()) {
      gapLines.forEach((line) => {
        resultArray = this.parseImportTemplates(line, resultArray, this.catTemplates)
      })
      resultMap.set(key, resultArray.join(''))
      resultArray.splice(0)
    }
    return resultMap
  }
}

export default CatJoinTemplates
