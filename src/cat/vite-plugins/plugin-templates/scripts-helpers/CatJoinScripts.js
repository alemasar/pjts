import CatParseScripts from './CatParseScripts'

class CatJoinScripts {
  constructor() {}
  getScripts(options, config, scripts) {
    let parsedScripts = new Map()

    if (scripts.length > 0) {
      const catParseScripts = new CatParseScripts()
      parsedScripts = catParseScripts.parseMultipleScripts(config, options, parsedScripts, scripts)
    }
    return parsedScripts
  }

}

export default CatJoinScripts
