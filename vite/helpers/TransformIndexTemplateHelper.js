import transformIndexTemplateFunctions from './TransformIndexTemplateFunctions';
import path from 'path';

export const initCatConfigComponents = (options) => {
  let template = []
  // let imports = ''
  let exports = ''
  
  const components = transformIndexTemplateFunctions.readAllFiles(path.normalize(`src/${options.components.base}/${options.components.path}`));
  components.forEach((cmp) => {
    const cmpName = cmp.name.trim()
    // imports += `import { ${cmpName} } from "@pjts/${options.components.path}/${cmpName}.cat";\n`
    exports += `
      import * as ${cmpName} from "@pjts/${options.components.path}/${cmpName}.cat";

      console.log(${cmpName})
      export const ${cmpName}Export = ${cmpName}.component;
    `
    template[cmpName] = {}
  })

  return {
    template,
    // imports,
    exports,
  }
}

export const getCatFileCode = (id, src, template) => {
  const tplObj = JSON.parse(JSON.stringify(template));
  const config = transformIndexTemplateFunctions.getConfig(src);
  const scriptTpl = transformIndexTemplateFunctions.getScriptTpl(src);
  const cmpNameKeys = Object.keys(tplObj);
  let tpl = transformIndexTemplateFunctions.getTpl(src);
  let code = '';

  cmpNameKeys.forEach((cnk) => {
    if (id.includes(cnk) === true) {
      tplObj[cnk] = transformIndexTemplateFunctions.setTemplateComponentObj(config.tag, cnk, tpl);
      tplObj[cnk] = transformIndexTemplateFunctions.setDataBindings(config.tag, cnk, tpl, tplObj[cnk]).template;
      tplObj[cnk] = transformIndexTemplateFunctions.setCatFor(config.tag, cnk, tpl, tplObj[cnk]).template;
      // const dataForObj = setCatFor(config.tag, cnk, tpl, template)
      if (scriptTpl !== '') {
        code = `
          ${scriptTpl}
          export default new ${cnk}();
          // component = ${JSON.stringify(Object.assign({}, {...tplObj[cnk]}))};
          console.log('entro EN CAT FILE');
        `
      }
    }
  })
  return {
    code,
    template: tplObj,
  };
}

export const transformTemplate = (tpl, template, bodyHTML) => {
  const templateElementsValues = Object.values(template)
  let indexHtml = tpl

  templateElementsValues.forEach((element) => {
    while (new RegExp(`<${element.tag}`).test(indexHtml) === true) {
      const iniPointTag = new RegExp(`<${element.tag}`).exec(indexHtml).index
      const endPointTag = new RegExp(`</${element.tag}>`).exec(indexHtml).index
      const codeToReplace = indexHtml.slice(iniPointTag, endPointTag + element.tag.length + 3)
      indexHtml = indexHtml.replaceAll(codeToReplace, template[element.name].template)
    }
  })
  indexHtml = indexHtml.replace('</body>', `<template id="indexTemplate">${bodyHTML}</template>
  </body>`)

  return indexHtml
}
