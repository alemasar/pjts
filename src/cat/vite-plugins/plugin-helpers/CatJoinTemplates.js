import CatParseTemplates from './CatParseTemplates'
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
    this.catParseTemplates = new CatParseTemplates()
    console.log(scripts)
    this.getTemplates(templates)
    this.template = generateGap({
      className: config.name + 'Gap',
      tagName: config.tag,
      parsedGaps: this.parsedGaps,
      scripts: this.scripts,
    })
  }
  getTemplates(templates) {
    if (templates !== null && templates.length > 1) {
      this.parsedGaps = this.catParseTemplates.parseMultipleTemplates(templates)
    } else if (templates !== null) {
      const splittedGaps = templates[0].split(breaklinesRegExp)
      this.catGaps.set('default', splittedGaps.join(''))
      this.parsedGaps = this.catGaps
    }
    return this.parsedGaps
  }
}

export default CatJoinTemplates
