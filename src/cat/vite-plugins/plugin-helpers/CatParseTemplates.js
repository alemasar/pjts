const templateGapRegExp = /<template cat-gap(.|[\s\S])*?<\/template>/g
const templateImportRegExp = /<template #import-id(.|[\s\S])*?<\/template>/g
const getRoutesGapRegExp = /cat-gap="(.|[\s\S])*?"/g
const getImportGapRegExp = /#import-id="(.|[\s\S])*?"/g
const breaklinesRegExp = /\r?\n|\r|\n/g
const getRequestGapRegExp = /#request "(.|[\s\S])*?"/g
const getImportTemplateRegExp = /#import "(.|[\s\S])*?"/g
class CatParseTemplates {
  constructor() {
    this.parsedGaps = new Map()
    this.catGaps = new Map()
    this.template = ''
    this.catTemplates = new Map()
  }
  parseMultipleTemplates(templates) {
    templates.forEach((template) => {
      if (template.length > 0) {
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
    return this.parsedGaps
  }
  parseTemplates(importTemplates) {
    importTemplates.forEach((it) => {
      const parsedImportTemplates = it.split(breaklinesRegExp)
      const importId = it.match(getImportGapRegExp)[0].trim().split(/=/g)[1].replace(/"/g, '')
      this.catTemplates.set(importId, parsedImportTemplates)
    })
    return this.catTemplates
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
    return this.catGaps
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

export default CatParseTemplates
