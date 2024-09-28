import { v4 as uuidv4 } from 'uuid';

const generateGap = (config) => {
  let returnTemplate = `
  import Gap from '@cat/cat-classes/CatGap'

  class ${config.className} extends Gap {
    constructor() {
      super();
      const temporalTemplate = document.createElement("template")
      const gaps = new Map();`
      console.log('GAP IN TEMPLATE',config.parsedGaps)
      for (var [key, gap] of config.parsedGaps) {
        console.log('GAP IN GAP TEMPLATE',gap)
        returnTemplate += `
        gaps.set('${key}', '${gap}')
        `
      }
      returnTemplate += `
      temporalTemplate.innerHTML = gaps.get('default')
      console.log('DENTRO DE GAP', temporalTemplate);
      temporalTemplate.content.querySelectorAll('template').forEach((t) => {
        this.appendChild(t.content.cloneNode(true))
      })
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

