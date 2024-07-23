import path from 'path';
import transformIndexTemplateHelper from "../helpers/TransformIndexTemplateHelper"
import transformIndexTemplateFunctions from '../helpers/TransformIndexTemplateFunctions';

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualComponentsId = 'virtual:components'
  const resolvedVirtualComponentId = '\0' + virtualComponentsId
  const catConfigComponent = transformIndexTemplateHelper.initCatConfigComponents(options)
  const exports = catConfigComponent.exports;
  let template = {...catConfigComponent.template};
  let originalUrl = ''

  return {
    name: 'vite-plugin-transform-components', // required, will show up in warnings and errors
    resolveId: {
      handler(id) {
        if (id === virtualComponentsId) {
          return resolvedVirtualComponentId
        }
      }
    },
    load: {
      handler(id) {
        if (id === resolvedVirtualComponentId) {
          return exports;
        }
      }
    },
    transform: {
      handler(src, id) {
        if (fileRegex.test(id) === true) {
          const srcModified = `
                                ${src}
                              `
          return {
            code: srcModified,
            map: null, // provide source map if available
          }
        } else if (id.endsWith(fileEndsWith) === true) {
          const componentName = id.split('/').pop().replace(fileEndsWith, '')
          let code = ''
          if (template[componentName].code) {
            const catConfig = transformIndexTemplateHelper.getCatFileCode(id, src, template, originalUrl)
            template = structuredClone(catConfig.template)
            code = template[componentName].code
          }

          return {
            code,
            map: null, // provide source map if available
          }
        }
      }
    },

    transformIndexHtml: {
      handler: (html, ctx) => {
        const pathCatComponent = path.normalize(`src/${options.components.base}/${options.components.path}`)    
        const catComponents = transformIndexTemplateFunctions.readAllFiles(pathCatComponent, '.cat')

        catComponents.forEach((cc) => {
          const catCode = transformIndexTemplateFunctions.getFileContents(path.join(cc.path, cc.name + '.cat'))
          const catTemplate = transformIndexTemplateHelper.getCatFileCode(path.join(cc.path, cc.name + '.cat'), catCode, template)
          template = structuredClone(catTemplate.template)
        })

        if (ctx.originalUrl) {
          const bodyPos = html.indexOf('<body');
          const openScriptPos = html.indexOf('<script', bodyPos + 1);
          const closeBody = html.indexOf('</body>', bodyPos + 1);
          let returnHtml = html.substring(0, openScriptPos)
          let indexHtml = html;
          let bodyHTML = '';
          const templates = transformIndexTemplateHelper.transformTemplate(options, indexHtml, template, ctx.originalUrl?.replace('/', ''))
    
          originalUrl = ctx.originalUrl
          bodyHTML = html.substring(html.indexOf(">", bodyPos + 1) + 1, closeBody).trim();
          indexHtml = `
          ${templates.indexHtml}
          `;
          returnHtml += `<cat-page></cat-page>`
    
          return returnHtml + indexHtml + bodyHTML + '</body></html>';
        }
      }
    }
  }
}
