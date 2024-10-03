import CatParseTemplates from './CatParseTemplates'
import generateGap from '../plugin-templates/gapTemplate'
const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinTemplates {
  constructor(templates, config, scripts) {
    this.parsedGaps = new Map()
    this.catGaps = new Map()
    this.catParseTemplates = new CatParseTemplates()

    this.getTemplates(templates)
    this.template = generateGap({
      className: config.name + 'Gap',
      tagName: config.tag,
      parsedGaps: this.parsedGaps,
      scripts,
    })
  }
  getTemplates(templates) {
    if (templates.length > 1) {
      this.parsedGaps = this.catParseTemplates.parseMultipleTemplates(templates)
    } else {
      const splittedGaps = templates[0].split(breaklinesRegExp)
      this.catGaps.set('default', splittedGaps.join(''))
      this.parsedGaps = this.catGaps
    }
    return this.parsedGaps
  }
}

export default CatJoinTemplates
