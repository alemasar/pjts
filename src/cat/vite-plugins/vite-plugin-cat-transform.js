import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import catTransformHelper from './plugin-helpers/CatTransformHelper'

const fileRegex = /main.ts$/
const fileCatEndsWith = '.cat'
const fileHTMLEndsWith = '.html'
const templates = []
let transformIndexState = 'before'
export default function transformIndextemplate(options) {
  const virtualComponentsId = 'virtual:components'
  const resolvedVirtualComponentId = '\0' + virtualComponentsId
  const allPagesFiles = catTransformHelper.readAllFiles(path.normalize(`src/${options.pages.base}/${options.pages.path}`), '.html')
  const allCatFiles = catTransformHelper.readAllFiles(path.normalize(`src/${options.components.base}/${options.components.path}`), '.cat')
  let catFilesImports = ''
  let pagesFilesImports = ''
  let beforeExportCatFiles = `const arrayComponents = []
`
  let beforeExportPagesFiles = `const arrayPages = []
`
  let exports = ``
allPagesFiles.forEach((pf, index) => {
    pagesFilesImports += `import page${index} from "@pjts-game/${options.pages.path}/${pf.name}.html";
`
    beforeExportPagesFiles +=`arrayPages.push(page${index})
`
})
allCatFiles.forEach((cf, index) => {
    console.log('CCCFFFF', cf)
    catFilesImports += `import component${index} from "@pjts-game/${options.components.path}/${cf.name}.cat";
`
    beforeExportCatFiles +=`arrayComponents.push(component${index})
`
  })
  exports += `
    console.log('VIRTUAL COMPONENT CAT FILE', arrayComponents)
    // helloWorld()
    export default {
      components: arrayComponents,
      pages: arrayPages,
    }
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
          console.log('RETURN EXPORTS OF VIRTUAL MODULE')
          return pagesFilesImports + catFilesImports + beforeExportPagesFiles + beforeExportCatFiles + exports;
        }
      }
    },
    transform: {
      handler(src, id) {
        let code = src
        console.log(id)
        if (id.endsWith(fileCatEndsWith) === true) {
          console.log('TRANSFORM CAT FILE',id)
          const uuid = uuidv4()
          let catConfigComponent = {}
          try{
            catConfigComponent = JSON.parse(catTransformHelper.getConfig(code))
          }catch(e) {
            // console.error(`%c${e}`, 'color: red;')
            console.error(`\x1b[31m%s\x1b[0m`, e);
          }
          const catTemplateComponent = catTransformHelper.getTemplate(code).replace('<template>', `<template cat-id="${uuid}">`)
          const tagName = catConfigComponent.tag
          const tags = Object.keys(templates)
          if (tags.includes(tagName) === false) {
            templates[tagName] = new Map()
          }
          templates[tagName].set(uuid, catTemplateComponent)
          code = `const returnTemplate = \`${templates[tagName].get(uuid)}\`
                  export default {
                    id: '${uuid}',
                    template: returnTemplate
                    tag: '${tagName}',
                  }
                `
        } else if (id.endsWith(fileHTMLEndsWith) === true) {
          const uuid = uuidv4()
          console.log('hola')
          code = `const returnTemplate = \`<template>${src}</template>\`
          export default {
                    id: '${uuid}',
                    page: returnTemplate
                    route: ${path.normalize(id).split('//').pop().replace('.html', '')}
                  }
                `
        }
        return {
          code,
          map: null, // provide source map if available
        }
      }
    },

    transformIndexHtml: {
      handler: (html, ctx) => {
        if (transformIndexState === 'before') {
          console.log('CALL TO TRANSFORM INDEX BEFORE', allPagesFiles)
          transformIndexState = 'after'
        } else if (transformIndexState === 'after') {
          console.log('CALL TO TRANSFORM INDEX AFTER')
        }
        return html;
      }
    }
  }
}

