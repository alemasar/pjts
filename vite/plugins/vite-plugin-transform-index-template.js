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
        console.log("TREMPLATE", catConfig.template)
        template = JSON.parse(JSON.stringify(catConfig.template))
        return {
          code: catConfig.code,
          map: null, // provide source map if available
        }
      }
    },
    transformIndexHtml(html) {
      const bodyPos = html.indexOf('<body');
      const closeScriptPos = html.indexOf('<script', bodyPos + 1)
      let indexHtml = html
      let bodyHTML = ''
      console.log("TREMPLATE", template)
      bodyHTML = html.substring(bodyPos, closeScriptPos)
      bodyHTML = bodyHTML.replace('<body>', '');
      indexHtml = `
      ${transformIndexTemplateHelper.transformTemplate(indexHtml, template, bodyHTML)}
      `
      return indexHtml;
    },
  }
}
