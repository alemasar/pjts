import CatParseTemplates from './CatParseTemplates'
const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinTemplates {
  constructor(config, templates) {
    this.template = this.getTemplates(config, templates)
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
