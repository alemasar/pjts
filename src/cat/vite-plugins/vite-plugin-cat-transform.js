import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import catTransformHelper from './plugin-helpers/CatTransformHelper'

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'
const templates = []
let transformIndexState = 'before'
export default function transformIndextemplate(options) {
  const virtualComponentsId = 'virtual:components'
  const resolvedVirtualComponentId = '\0' + virtualComponentsId
  const allCatFiles = catTransformHelper.readAllFiles(path.normalize(`src/${options.components.base}/${options.components.path}`), '.cat')
  let exports = ''
  allCatFiles.forEach((cf) => {
    console.log('CCCFFFF', cf)
    exports = `
      import component from "@pjts-game/${options.components.path}/${cf.name}.cat";
      console.log('VIRTUAL COMPONENT CAT FILE', component)
      // helloWorld()
      export default component
    `
  })
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
          return exports;
        }
      }
    },
    transform: {
      handler(src, id) {
        let code = src
        console.log(id)
        if (id.endsWith(fileEndsWith) === true) {
          console.log('TRANSFORM CAT FILE',id)
          const uuid = uuidv4()
          const catConfigComponent = JSON.parse(catTransformHelper.getConfig(code))
          const catTemplateComponent = catTransformHelper.getTemplate(code).replace('<template>', `<template cat-id="${uuid}">`)
          const tagName = catConfigComponent.tag
          const tags = Object.keys(templates)
          if (tags.includes(tagName) === false) {
            templates[tagName] = new Map()
          }
          templates[tagName].set(uuid, catTemplateComponent)
          code = `const returnTemplate = \`${templates[tagName].get(uuid)}\`
                  export default {
                    tag: '${tagName}',
                    id: '${uuid}',
                    template: returnTemplate
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
          console.log('CALL TO TRANSFORM INDEX BEFORE')
          transformIndexState = 'after'
        } else if (transformIndexState === 'after') {
          console.log('CALL TO TRANSFORM INDEX AFTER')
        }
        return html;
      }
    }
  }
}
