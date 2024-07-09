import { readAllFiles, getConfig, getTpl, transformTemplate, setDataBindings, setCatFor, setTemplateConfigObj } from "../helpers/TransformIndexTemplateHelper"

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let template = []
  let imports = ''
  let exports = ''
  

  const components = readAllFiles(`src/${options.components.base}/${options.components.path}`)
  components.forEach((cmp) => {
    const cmpName = cmp.name.trim()
    imports += `import { ${cmpName} } from "@pjts/${options.components.path}/${cmpName}.cat";\n`
    exports += `
      import * as ${cmpName} from "@pjts/${options.components.path}/${cmpName}.cat";

      console.log(${cmpName})
      export const ${cmpName}Export = ${cmpName}.component;
    `
    template[cmpName] = {}
  })
  return {
    name: 'vite-plugin-transform-components', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return exports;
      }
    },
    transform(src, id) {
      if (fileRegex.test(id) === true) {
        const srcModified = `
                              ${src}
                            `
        return {
          code: srcModified,
          map: null, // provide source map if available
        }
      } else if (id.endsWith(fileEndsWith) === true) {
        const config = getConfig(src);
        const cmpNameKeys = Object.keys(template);
        let tpl = getTpl(src);
        let code = '';
        cmpNameKeys.forEach((cnk) => {
          if (id.includes(cnk) === true) {
            template[cnk] = setTemplateConfigObj(config.tag, cnk, tpl);
            template[cnk] = setDataBindings(config.tag, cnk, tpl, template[cnk]).template;
            template[cnk] = setCatFor(config.tag, cnk, tpl, template[cnk]).template;
            // const dataForObj = setCatFor(config.tag, cnk, tpl, template)
            code = `
              export const component = ${JSON.stringify(Object.assign({}, {...template[cnk]}))};
              console.log('entro EN CAT FILE', component);
            `
          }
        })
        return {
          code,
          map: null, // provide source map if available
        }
      }
    },
    transformIndexHtml(html) {
      const bodyPos = html.indexOf('<body');
      const closeScriptPos = html.indexOf('<script', bodyPos + 1)
      let indexHtml = html
      let bodyHTML = ''
      bodyHTML = html.substring(bodyPos, closeScriptPos)
      bodyHTML = bodyHTML.replace('<body>', '');
      const test = 'TEST'
      indexHtml = `
      ${transformTemplate(indexHtml, template, bodyHTML)}
      `
      return indexHtml;
    },
  }
}
