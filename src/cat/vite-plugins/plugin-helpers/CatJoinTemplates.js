import CatParseTemplates from './CatParseTemplates'
import generateGap from '../plugin-templates/gapTemplate'
const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinTemplates {
  constructor(templates, config, scripts) {
    this.template = generateGap({
      className: config.name + 'Gap',
      tagName: config.tag,
      parsedGaps: this.getTemplates(templates),
      scripts,
    })
  }
  getTemplates(templates) {
    let parsedGaps = new Map()
    if (templates.length > 1) {
      const catParseTemplates = new CatParseTemplates()
      parsedGaps = catParseTemplates.parseMultipleTemplates(templates)
    } else {
      const splittedGaps = templates[0].split(breaklinesRegExp)
      parsedGaps.set('default', splittedGaps.join(''))
    }
    return parsedGaps
  }
}

export default CatJoinTemplates
