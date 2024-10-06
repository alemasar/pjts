import CatParseScripts from './CatParseScripts'

const breaklinesRegExp = /\r?\n|\r|\n/g

class CatJoinScripts {
  constructor() {}
  getScripts(scripts) {
    let parsedScripts = new Map()

    if (scripts.length > 1) {
      const catParseScripts = new CatParseScripts()
      catParseScripts.parseMultipleScripts(scripts)
    } else {
      const splittedScripts = scripts[0].split(breaklinesRegExp)
      parsedScripts.set('default', splittedScripts.join(''))
    }
    return parsedScripts
  }

}

export default CatJoinScripts