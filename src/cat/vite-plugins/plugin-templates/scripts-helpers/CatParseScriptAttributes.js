const scriptRegExp = /<script/
const getCatGapRouteScriptRegExp = /#cat-gap/g
const getRouteArrayRegExp = /\[(.|[\s\S])*\]/g

class CatParseScriptAttributes {
  constructor(scriptTag) {
    this.scriptTag = scriptTag.replace(scriptRegExp, '').replace(/>/, '').replace(/^\s/g, '')
  }
  getRoutes() {
    const routeLine = ''
    if (this.scriptTag.match(getCatGapRouteScriptRegExp) !== null) {
      const splittedAttributes = this.scriptTag.split(/\s#/g)
      splittedAttributes.forEach((sa) => {
        const attributes = sa.replace(/^#/g, '').replace(/\s/g, '')
        if (attributes.match(/cat-gap=/) !== null) {
          const routes = attributes.replace(/^cat-gap=/, '')
          .replace(/"|'/g, '')
          .replace(/"|'+$/, '')
          .replace(/^\[/, '')
          .replace(/\]+$/, '')
          .split(',')
          console.log(routes)

        }
       //  const routesString = attributes.replace()
        /* .forEach((attribute) => {
          if (attribute.match(/cat-gap=/) !== null) {
            const routes = attribute.replace(/^cat-gap=/, '')
          }
        }) */
      })
    }
    return 'HOLA'
  }
}

export default CatParseScriptAttributes