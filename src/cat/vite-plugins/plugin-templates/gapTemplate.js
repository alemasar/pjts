import { v4 as uuidv4 } from 'uuid';

const addToTemplate = (route, template) => {
  const returnTemplate = `
    this.gaps.set('${route}', \`${template.join('\n')}\`)
  `
  return returnTemplate
}



const generateGap = (config) => {
  let returnTemplate = `
  import Gap from "@cat/cat-classes/CatGap"
  import { v4 as uuidv4 } from "uuid"

  class ${config.className} extends Gap {
    constructor() {
      super();
      // console.log('GAP IN TEMPLATE')
      `
      console.log('GAP IN TEMPLATE::::', config)
      if (config.catGaps.has(config.tagName) === true) {
        for (let [route, gap] of config.catGaps.get(config.tagName)) {
          if (gap.size === 1 || route !== 'default'){
            returnTemplate += addToTemplate(route, gap.get('template'))
          }
        }
      }
      /* if (config.scripts !== '') {
        returnTemplate += `
          this.scripts = new Map()
        `
        for (let [route, scriptsMap] of config.scripts) {
          for (let [template, script] of scriptsMap) {
            returnTemplate += `
            if (this.scripts.has('${route}') === false) {
              this.scripts.set('${route}', new Map())
            }
            this.scripts.get('${route}').set('${template}', \`${script}\`)
            `
          }
        }
      } */
      returnTemplate += `
      console.log(this.gaps)
    }
  }
  export default ()=> {
    return {
      classCode: ${config.className},
      tag: '${config.tagName}',
      id: '${uuidv4()}'
    }
  }
  `
  return returnTemplate
}
export default generateGap

