import { v4 as uuidv4 } from 'uuid';

const generateGap = (config) => {
  let returnTemplate = `
  import Gap from '@cat/cat-classes/CatGap'
  const gaps = new Map();`
  for (var [key, gap] of config.gaps) {
    returnTemplate += `
    gaps.set('${key}', '${gap}')
    `
  }

returnTemplate += `
  class ${config.className} extends Gap {
    constructor() {
      super();
      const temporalTemplate = document.createElement("template")
      console.log('DENTRO DE GAP', temporalTemplate);
      temporalTemplate.innerHTML = gaps.get('default')
      this.appendChild(temporalTemplate.content.querySelector('template').content.cloneNode(true))
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

console.log('GAP TEMPLATE', returnTemplate)
  return returnTemplate
}
export default generateGap

