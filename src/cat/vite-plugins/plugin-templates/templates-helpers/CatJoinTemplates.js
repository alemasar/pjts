import CatParseTemplates from './CatParseTemplates'
import generateGap from '../gapTemplate'
const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinTemplates {
  constructor(templates, config, scripts) {
    this.template = generateGap({
      className: config.name + 'Gap',
      tagName: config.tag,
      parsedGaps: this.getTemplates(config, templates),
      scripts,
    })
  }
  getTemplates(config, templates) {
    let parsedTemplates = new Map()
    let gapsAndTemplates = {}

    if (templates.length > 1) {
      const catParseTemplates = new CatParseTemplates()
      gapsAndTemplates = catParseTemplates.getGapsAndTemplates(config, templates)
      parsedTemplates = catParseTemplates.joinGapsAndTemplates(gapsAndTemplates)
    } else {
      const splittedGaps = templates[0].split(breaklinesRegExp)
      if (parsedTemplates.has(config.tag) === false) {
        parsedTemplates.set(config.tag, new Map())
      }
      parsedTemplates.get(config.tag).set('default', splittedGaps)
    }
    return parsedTemplates
  }
}

export default CatJoinTemplates
