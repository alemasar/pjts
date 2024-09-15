import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import catTransformHelper from './plugin-helpers/CatTransformHelper'

const fileRegex = /main.ts$/
const fileCatEndsWith = '.cat'
const fileHTMLEndsWith = '.html'
const templates = []
const pages = []
let urlPage = ''
let htmlIndex = ''
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
    console.log('VIRTUAL COMPONENT CAT FILE', arrayPages)
    // helloWorld()
    export default {
      routes: arrayPages,
      components: arrayComponents,
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
          return pagesFilesImports + catFilesImports + beforeExportPagesFiles + beforeExportCatFiles + exports;
        }
      }
    },
    /* transform: {
      handler(src, id) {
        let code = src
        console.log(id)
        if (id.endsWith(fileCatEndsWith) === true) {
          // console.log('TRANSFORM CAT FILE',id)
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
                    template: returnTemplate,
                    tag: '${tagName}',
                    nameClass: 'Prova',
                    tagClass: 
                    class Prova extends HTMLElement {
                      constructor() {
                        super()
                        const template = this.querySelector('#template');
                        console.log('CONSTRUCTOR PROVA CLASS', template)
                        this.innerHTML = \`${templates[tagName].get(uuid).replace(`<template cat-id="${uuid}">`, '').replace('</template>', '')}\`
                      }
                    }
                  }
                `
        } else if (id.endsWith(fileHTMLEndsWith) === true) {
          const uuid = uuidv4()
          const route = id.split('/').pop().replace('.html', '')
          const templateHTML = `${src}`
          code = `const returnTemplate = \`${templateHTML}\`
          export default {
                    id: '${uuid}',
                    template: returnTemplate,
                    route: \`${route}\`
                  }
                `
          pages[route] = {
            id: uuid,
            route,
            template: templateHTML,
          }
        }
        return {
          code,
          map: null, // provide source map if available
        }
      }
    }, */
    transformIndexHtml (html, ctx){
      /* if (ctx.server) {
        if (ctx.originalUrl && urlPage === '') {
          urlPage = ctx.originalUrl
          htmlIndex = html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />`)
          return htmlIndex
        } else if (urlPage !== ''){
          let routeUrl = urlPage.replace('/', '', 'g')
          let templateUrl = 'index'
          
          if (routeUrl !== '') {
            templateUrl = routeUrl
          }
          console.log('RETURN HTML REPLACED', htmlIndex.replace('<cat-page></cat-page>', `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`))
          return htmlIndex.replace('<cat-page></cat-page>', `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`);
        }
      } */
          console.log('RETURN HTML')
      return html
    },
/*
    transformIndexHtml (html, ctx){
      let returnHTML = html
      if (ctx.bundle) {
        urlPage = ctx.originalUrl
        // console.log('CALL TO TRANSFORM INDEX BEFORE', ctx.originalUrl)
        transformIndexState = 'after'
      } 
      if (ctx.chunk) {
        let routeUrl = urlPage.replace('/', '', 'g')
        let templateUrl = 'index'

        if (routeUrl !== '') {
          templateUrl = routeUrl
        }
        returnHTML = html.replace('<cat-page></cat-page>', `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`)
        // console.log('CALL TO TRANSFORM INDEX AFTER', pages[templateUrl])
        // transformIndexState = 'before'
        return returnHTML;
      }
    } */
  }
}

