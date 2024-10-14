import CatParseTemplatesAttributes from './CatParseTemplatesAttributes'

const templateRegExp = /<template/
const importIdRegExp = /(=?".*")/
const breaklinesRegExp = /\r?\n|\r|\n/g

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
  }

  setImportTemplates(templateLine, importTemplates, cleanTemplate) {
    const importIdsTemplates = this.catParseTemplatesAttributes.importTemplates(templateLine, cleanTemplate)
    const importTemplate = importTemplates

    for (let [key, template] of importIdsTemplates.entries()) {
      importTemplate.set(key, template)
    }
  }

  getGapsAndTemplates(config, templatesArray) {
    let catGaps = new Map()
    let importTemplates = new Map()

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
      } else if (templateLine.includes('#cat-gap') === false) {
        if (importTemplates.has(config.tag) === false) {
          importTemplates.set(config.tag, new Map())
        }
        this.setImportTemplates(templateLine, importTemplates.get(config.tag), cleanTemplate)
      }
    })

    return {
      catGaps,
      importTemplates,
    }
  }

  getGapsImport(tag, gapTemplate, templatesMap){
    const template = []

    console.log(templatesMap.get(tag))
    if (templatesMap.get(tag).has('default') === true) {
      template.push(...templatesMap.get(tag).get('default'))
    }
    gapTemplate.forEach((gt) => {
      if (gt.includes('#import') === true) {
        const importId = gt.match(importIdRegExp)[0].replace(/"/g, '')
        if (templatesMap.get(tag).has(importId) === true) {
          template.push(...templatesMap.get(tag).get(importId))
        }
      }
    })

    return template
  }

  joinGapsAndTemplates(gapsAndTemplates) {
    const template = new Map()
    const gapsMap = gapsAndTemplates.catGaps
    const templatesMap = gapsAndTemplates.importTemplates

    for (let [tag, catGaps] of gapsMap.entries()) {
      let importId = 'default'

      if (template.has(tag) === false) {
        template.set(tag, new Map())
      }

      if (templatesMap.has(tag) === true && templatesMap.get(tag).has(importId) === true) {
        if (template.get(tag).has('index') === false) {
          template.get(tag).set('index', [])
        }
        template.get(tag).set('index', templatesMap.get(tag).get(importId))
      }

      for (let [id, gapTemplate] of catGaps.entries()) {
        let idGap = id
        if (id === 'default') {
          idGap = 'index'
        }
        if (template.get(tag).has(idGap) === false) {
          template.get(tag).set(idGap, [])
        }
        template.get(tag).set(idGap, this.getGapsImport(tag, gapTemplate, templatesMap))
      }
    }

    return template
  }
}

export default CatParseTemplates
