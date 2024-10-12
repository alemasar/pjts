const scriptRegExp = /<script/
const catGapRouteScriptRegExp = /#cat-gap/g
const catGapImportTemplateRegExp = /#import-id/g
const catGapRegExp = /^cat-gap=/
const importTemplateRegExp = /^import-id=/

const getAttributesValues = (regExp, attributes) => {
  return attributes.replace(regExp, '').
          replace(/"|'/g, '').
          replace(/"|'+$/, '').
          replace(/^\[/, '').
          replace(/\]+$/, '').
          split(',')
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
    } else if(this.scriptTag.match(catGapImportTemplateRegExp) !== null) {
      const importTemplate = this.scriptTag.replace(/^#/g, '').replace(/\s/g, '')
      importTemplates = getAttributesValues(importTemplateRegExp, importTemplate)
    }
    if (routes.length === 0) {
      routes.push('default')
    }
    if (importTemplates.length === 0) {
      importTemplates.push('default')
    }
    return {
      tag: config.tag,
      routes,
      importTemplates,
    }
  }
}

export default CatParseScriptAttributes
