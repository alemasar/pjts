import CatParseTemplatesAttributes from './CatParseTemplatesAttributes'

const templateRegExp = /<template/
const templateGapRegExp = /<template #cat-gap(.|[\s\S])*?<\/template>/g
const templateImportRegExp = /<template #import-id(.|[\s\S])*?<\/template>/g
const routesGapRegExp = /#cat-gap="(.|[\s\S])*?"/g
const importGapRegExp = /#import-id="(.|[\s\S])*?"/g
const breaklinesRegExp = /\r?\n|\r|\n/g

const parseTemplates = (importTemplates, catTemplates) => {
  importTemplates.forEach((it) => {
    const parsedImportTemplates = it.split(breaklinesRegExp)  
    const importId = it.match(importGapRegExp)[0].trim().split(/=/g)[1].replace(/"/g, '')

    parsedImportTemplates[0] = parsedImportTemplates[0].replace('#import-', '')
    catTemplates.set(importId, parsedImportTemplates)
  })
  return catTemplates
}

const parseRouteGaps = (defaultGaps, catGaps) => {
  let routeName = {}
  let splittedGaps = []

  defaultGaps.forEach((dg) => {
    splittedGaps = dg.split(breaklinesRegExp)
    if (dg.includes('#cat-gap=') === true) {
      const arrayRoutes = splittedGaps[0].
        replace(`<template #cat-gap="`, '').
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

const deleteComments = (splittedTemplateCode) => {
  const cleanCode = []
  let startMultilineComment = false

  splittedTemplateCode.forEach((templateLine, index) => {
    let startLineIndex = -1
    let endLineIndex = -1
    if (templateLine.includes('<!--') === true) {
      startLineIndex = index
      startMultilineComment = true
    } 
    if (templateLine.includes('-->') === true) {
      endLineIndex = index
      startMultilineComment = false
    }
    if (startLineIndex !== -1 && startLineIndex === endLineIndex) {
      let resultTemplate = ''
      let startHtml = 0
      let posStartComment = templateLine.indexOf('<!--')
      while (posStartComment !== -1) {
        resultTemplate += templateLine.substring(startHtml, posStartComment)
        startHtml = templateLine.indexOf('-->', posStartComment) + 3
        posStartComment = templateLine.indexOf('<!--', posStartComment + 1)
      }
      resultTemplate += templateLine.substring(startHtml, templateLine.length)
      cleanCode.push(templateLine.replace(templateLine, resultTemplate))
    } else if (startMultilineComment === false && templateLine.includes('-->') === false) {
      cleanCode.push(templateLine)
    }
  })
  return cleanCode
}

class CatParseTemplates {
  constructor() {
    this.catParseTemplatesAttributes = new CatParseTemplatesAttributes()
  }
  setGaps(templateLine, catGaps, cleanTemplate) {
    const gaps = this.catParseTemplatesAttributes.catGap(templateLine, cleanTemplate)
    const catGap = catGaps

    for (let [key, gap] of gaps.entries()) {
      catGap.set(key, gap)
    }
    console.log('CAT GAP:::::::::', catGap)
    return gaps
  }
  parseMultipleTemplates(config, templatesArray) {
    let catGaps = new Map()
    let templates = new Map()
    let attributesTemplate = new Map()
    let parsedGaps = new Map()
    let catTemplates = new Map()

    templatesArray.forEach((template) => {
      const cleanTemplate = deleteComments(template.split(breaklinesRegExp))
      const templateLine = cleanTemplate[0].replace(templateRegExp, '').
        replace(/>/, '').
        replace(/^\s/g, '')

      if (templateLine.includes('#cat-gap') === true) {
        if (catGaps.has(config.tag) === false) {
          catGaps.set(config.tag, new Map())
        }
        this.setGaps(templateLine, catGaps.get(config.tag), cleanTemplate)
      }
    })
    return catGaps

    /* templates.forEach((template) => {
      const importTemplates = template.match(templateImportRegExp)
      const routeGaps = template.match(routesGapRegExp)
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
    })
    parsedGaps = parseGaps(catGaps, catTemplates)
    return parsedGaps */
  }
}

export default CatParseTemplates
