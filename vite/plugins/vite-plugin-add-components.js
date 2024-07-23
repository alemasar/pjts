import transformIndexTemplateHelper from "../helpers/TransformIndexTemplateHelper"

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
          console.log('ENTRO EN RESOLVEID', id)
          return resolvedVirtualComponentId
        }
      }
    },
    load: {
      handler(id) {
        if (id === resolvedVirtualComponentId) {
          console.log('ENTRO EN LOAD', id)
          return exports;
        }
      }
    },
    transform: {
      handler(src, id) {
        console.log('ENTRO EN TRANSFORM', id)
        //console.log(ctx.originalUrl)
        if (fileRegex.test(id) === true) {
          const srcModified = `
                                ${src}
                              `
          return {
            code: srcModified,
            map: null, // provide source map if available
          }
        } else if (id.endsWith(fileEndsWith) === true) {
          const catConfig = transformIndexTemplateHelper.getCatFileCode(id, src, template, originalUrl)
          
          template = structuredClone(catConfig.template)
          return {
            code: catConfig.code,
            map: null, // provide source map if available
          }
        }
      }
    },
  }
}
