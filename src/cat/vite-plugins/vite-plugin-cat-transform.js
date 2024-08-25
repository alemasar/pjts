import path from 'path';

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualComponentsId = 'virtual:components'
  const resolvedVirtualComponentId = '\0' + virtualComponentsId
  const exports = `
    import helloWorld from "@pjts-game/components/hello-world.cat";
    console.log('VIRTUAL COMPONENT CAT FILE')
    helloWorld()
  `
  return {
    name: 'vite-plugin-cat-transform', // required, will show up in warnings and errors
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
        let code = src
        console.log(id)
        /* if (fileRegex.test(id) === true) {
          const srcModified = `
                                ${src}
                              `
          return {
            code: srcModified,
            map: null, // provide source map if available
          }
        } else */ 
        if (id.endsWith(fileEndsWith) === true) {
          console.log('PASO PER TRANSFORM CAT FILE')
          /* return {
            code: src,
            map: null, // provide source map if available
          } */
        }
        return {
          code,
          map: null, // provide source map if available
        }
      }
    },

    transformIndexHtml: {
      handler: (html, ctx) => {
        return html;
      }
    }
  }
}
