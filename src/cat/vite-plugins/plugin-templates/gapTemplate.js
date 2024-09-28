import { v4 as uuidv4 } from 'uuid';

const generateGap = (config) => {
  let returnTemplate = `
  import Gap from "@cat/cat-classes/CatGap"

  class ${config.className} extends Gap {
    constructor() {
      super();
      `
      console.log('GAP IN TEMPLATE',config.parsedGaps)
      for (var [key, gap] of config.parsedGaps) {
        returnTemplate += `
        this.gaps.set('${key}', '${gap}')
        `
      }
      returnTemplate += `
      this.changeGapRoute('default')
    }
  }
  // customElements.define('${config.tagName}', ${config.className})
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

