import transformIndexTemplateFunctions from './TransformIndexTemplateFunctions';
import path from 'path';
class TransformIndexTemplateHelper {
  initCatConfigComponents(options) {
    let template = []
    // let imports = ''
    let exports = ''
    const components = transformIndexTemplateFunctions.readAllFiles(path.normalize(`src/${options.components.base}/${options.components.path}`), '.cat');

    components.forEach((cmp) => {
      const cmpName = cmp.name.trim()
      // imports += `import { ${cmpName} } from "@pjts/${options.components.path}/${cmpName}.cat";\n`
      exports += `
        import * as ${cmpName} from "@pjts/${options.components.path}/${cmpName}.cat";

        export const ${cmpName}Export = ${cmpName};
      `
      template[cmpName] = {}
    })

    return {
      template,
      // imports,
      exports,
    }
  }

  getCatFileCode(id, src, template) {
    const tplObj = structuredClone(template);
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

        if (scriptTpl !== '') {
          code = `
            ${scriptTpl}
            export default new ${cnk}();
            console.log('entro EN CAT FILE');
          `
        }
        tplObj[cnk].code = code
      }
    })

    return {
      code,
      template: tplObj,
    };
  }

  transformTemplate(options, tpl, template, originalURL) {
    const templateElementsValues = Object.values(template)
    const pathHtmlPages = path.normalize(`src/${options.pages.base}/${options.pages.path}`)
    const pages = transformIndexTemplateFunctions.readAllFiles(pathHtmlPages, '.html');
    let indexHtml = ''
    let fallbackTemplate = ''
    
    pages.forEach((p) => {
      let pageHTML = transformIndexTemplateFunctions.getFileContents(`src/${options.pages.base}/${options.pages.path}/${p.name}.html`)
      templateElementsValues.forEach((element) => {
        while (new RegExp(`<${element.tag}`).test(pageHTML) === true) {
          const iniPointTag = new RegExp(`<${element.tag}`).exec(pageHTML).index
          const endPointTag = new RegExp(`</${element.tag}>`).exec(pageHTML).index
          const codeToReplace = pageHTML.slice(iniPointTag, endPointTag + element.tag.length + 3)

          pageHTML = pageHTML.replaceAll(codeToReplace, template[element.name].template)
        }
      })
      // indexHtml = indexHtml.replace('</body>', `<template id="${p.name}Template">${pageHTML}</template></body>`);
      indexHtml += `<template id="${p.name}Template">\r\n${pageHTML}\r\n</template>\r\n`
      if (p.name === originalURL) {
        fallbackTemplate = pageHTML
      }
    })

    return {
      indexHtml,
      fallbackTemplate,
    }
  }
}

export default new TransformIndexTemplateHelper();
