const scriptRegExp = /<script/
const catGapRouteScriptRegExp = /#cat-gap/g
const catGapImportTemplateRegExp = /#import-id/g
const catGapRegExp = /^cat-gap=/
const importTemplateRegExp = /^import-id=/

const getAttributesValues = (regExp, attributes) => {
  return attributes.replace(regExp, '')
          .replace(/"|'/g, '')
          .replace(/"|'+$/, '')
          .replace(/^\[/, '')
          .replace(/\]+$/, '')
          .split(',')
}

class CatParseScriptAttributes {
  constructor(scriptTag) {
    this.scriptTag = scriptTag.replace(scriptRegExp, '').replace(/>/, '').replace(/^\s/g, '')
  }
  getRoutes(config) {
    let routes = [] 
    let importTemplates = []
    if (this.scriptTag.match(catGapRouteScriptRegExp) !== null) {
      const splittedAttributes = this.scriptTag.split(/\s#/g)
      splittedAttributes.forEach((sa) => {
        const attributes = sa.replace(/^#/g, '').replace(/\s/g, '')
        if (attributes.match(catGapRegExp) !== null) {
          routes = getAttributesValues(catGapRegExp, attributes)
        }
        if (attributes.match(importTemplateRegExp) !== null) {
          importTemplates = getAttributesValues(importTemplateRegExp, attributes)
        }
      })
    } else if(this.scriptTag.catGapImportTemplateRegExp !== null) {
      const importTemplate = this.scriptTag.replace(/^#/g, '').replace(/\s/g, '')
      importTemplates = getAttributesValues(importTemplateRegExp, importTemplate)
      console.log(importTemplates)
    }
    return {
      tag: config.tag,
      routes,
      importTemplates,
    }
  }
}

export default CatParseScriptAttributes
