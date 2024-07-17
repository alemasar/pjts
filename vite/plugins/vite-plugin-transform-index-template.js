import transformIndexTemplateHelper from "../helpers/TransformIndexTemplateHelper"

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualComponentsId = 'virtual:components'
  const resolvedVirtualComponentId = '\0' + virtualComponentsId
  const catConfigComponent = transformIndexTemplateHelper.initCatConfigComponents(options)
  const exports = catConfigComponent.exports;
  let template = {...catConfigComponent.template};

  return {
    name: 'vite-plugin-transform-components', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualComponentsId) {
        return resolvedVirtualComponentId
      }
    },
    load(id) {
      if (id === resolvedVirtualComponentId) {
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
        const catConfig = transformIndexTemplateHelper.getCatFileCode(id, src, template)
        
        template = structuredClone(catConfig.template)
        return {
          code: catConfig.code,
          map: null, // provide source map if available
        }
      }
    },
    transformIndexHtml(html) {
      const bodyPos = html.indexOf('<body');
      const openScriptPos = html.indexOf('<script', bodyPos + 1);
      const closeBody = html.indexOf('</body>', bodyPos + 1);
      let returnHtml = html.substring(0, openScriptPos)
      let indexHtml = html;
      let bodyHTML = '';

      returnHtml += '<cat-page></cat-page>'
      bodyHTML = html.substring(html.indexOf(">", bodyPos + 1) + 1, closeBody).trim();
      indexHtml = `
      ${transformIndexTemplateHelper.transformTemplate(options, indexHtml, template)}
      `;
      return returnHtml + indexHtml + bodyHTML + '</body></html>';
    },
  }
}
