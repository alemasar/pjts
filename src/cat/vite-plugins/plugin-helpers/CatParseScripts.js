const breaklinesRegExp = /\r?\n|\r|\n/g

class CatParseScripts {
  constructor(config, scripts) {
    this.scripts = new Map()
    if (scripts !== null) {
      if (scripts.length > 0) {
        scripts.forEach((s) => {
          const splittedScript = s.split(breaklinesRegExp)
          console.log('CATPARSESCRIPTS::::', splittedScript)
        })
      }
    }
  }
}

export default CatParseScripts
