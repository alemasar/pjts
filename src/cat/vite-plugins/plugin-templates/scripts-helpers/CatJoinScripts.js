import CatParseScripts from './CatParseScripts'
const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinScripts {
  constructor(config, scripts) {
    this.scripts = this.getScripts(config, scripts)
  }
  getScripts(config, scripts) {
    let parsedScripts = new Map()

    if (scripts.length > 1) {
      const catParseScripts = new CatParseScripts()

      parsedScripts = catParseScripts.getGapsAndScripts(config, scripts)
    } else  if (scripts.length === 1) {
      const splittedScript = templates[0].split(breaklinesRegExp)
      if (parsedScripts.has(config.tag) === false) {
        parsedScripts.set(config.tag, new Map())
      }
      parsedScripts.get(config.tag).set('default', splittedScript)
    }
    return parsedScripts
  }

}

export default CatJoinScripts
