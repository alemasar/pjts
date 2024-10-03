const templateGapRegExp = /<template cat-gap(.|[\s\S])*?<\/template>/g
const templateImportRegExp = /<template #import-id(.|[\s\S])*?<\/template>/g
const getRoutesGapRegExp = /cat-gap="(.|[\s\S])*?"/g
const getImportGapRegExp = /#import-id="(.|[\s\S])*?"/g
const breaklinesRegExp = /\r?\n|\r|\n/g
const getRequestGapRegExp = /#request "(.|[\s\S])*?"/g
const getImportTemplateRegExp = /#import "(.|[\s\S])*?"/g

const parseTemplates = (importTemplates, catTemplates) => {
  importTemplates.forEach((it) => {
    const parsedImportTemplates = it.split(breaklinesRegExp)
    const importId = it.match(getImportGapRegExp)[0].trim().split(/=/g)[1].replace(/"/g, '')
    catTemplates.set(importId, parsedImportTemplates)
  })
  return catTemplates
}

const parseRouteGaps = (defaultGaps, catGaps) => {
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
    catGaps.set(rn, splittedGaps)
  })
  return catGaps
}

const parseImportTemplates = (line, resultArray, catTemplates) => {
  const gapLinePos = line.indexOf('#import')
  if (gapLinePos !== -1) {
    const importId = line.trim().split(' ')[1].replace(/"/g, '')
    resultArray = resultArray.concat(catTemplates.get(importId))
  }
  return resultArray
}

const parseGaps = (gapLinesMap, catTemplates) => {
  const resultMap = new Map()
  let resultArray = []
  for (let [key, gapLines] of gapLinesMap.entries()) {
    gapLines.forEach((line) => {
      resultArray = parseImportTemplates(line, resultArray, catTemplates)
    })
    resultMap.set(key, resultArray.join(''))
    resultArray.splice(0)
  }
  return resultMap
}


class CatParseTemplates {
  constructor() {}
  parseMultipleTemplates(templates) {
    let catGaps = new Map()
    let parsedGaps = new Map()
    let catTemplates = new Map()
    templates.forEach((template) => {
      if (template.length > 0) {
        const importTemplates = template.match(templateImportRegExp)
        const routeGaps = template.match(getRoutesGapRegExp)
        const defaultGaps = template.match(templateGapRegExp)
        if (importTemplates !== null) {
          catTemplates = parseTemplates(importTemplates, catTemplates)
        }
        if (routeGaps !== null) {
          catGaps = parseRouteGaps(defaultGaps, catGaps)
        } else if (defaultGaps !== null && defaultGaps.length > 0) {
          const splittedGaps = template.split(breaklinesRegExp)
          catGaps.set('index', splittedGaps)
        }
      }
    })
    parsedGaps = parseGaps(catGaps, catTemplates)
    return parsedGaps
  }
}

export default CatParseTemplates
