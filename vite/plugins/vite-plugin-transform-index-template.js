import { readAllFiles, getConfig, getTpl, transformTemplate } from "../helpers/TransformIndexTemplateHelper"

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let template = []
  let imports = ''
  let exports = ''
  let pageTemplate = ''

  const components = readAllFiles(`src/${options.components.base}/${options.components.path}`)
  
  components.forEach((cmp) => {
    const cmpName = cmp.name.trim()
    imports += `import { ${cmpName} } from "@pjts/components/${cmpName}.cat";\n`
    exports += `
      import * as ${cmpName} from "@pjts/components/${cmpName}.cat";

      console.log(${cmpName}.component)
      export const ${cmpName}Export = ${cmpName}.component;
    `
    template[cmpName] = {}
    // imports += `import { ${cmpName} } from 'virtual:my-module';`
    // defines += `${cmpName}.defineCustomElements()`
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
      console.log('FILES:::::',id)
      if (fileRegex.test(id) === true) {
        // const component = await import('../../src/pjts/components/MyTagExtendSchema.cat?raw')
        // console.log('MAIN FILE::::::::::::', src)
        // ${imports}
        const srcModified = `
                              ${src}
                              
                              export default function myInfo(fname, lname, country) {
                                return "My name is " + fname + " " + lname + ". " + country + " is my favorite country";
                              }
                            `
        return {
          code: srcModified,
          map: null, // provide source map if available
        }
      } else if (id.endsWith(fileEndsWith) === true) {
        const config = getConfig(src)
        const tpl = getTpl(src)
        const cmpNameKeys = Object.keys(template)
        let key = ''
        cmpNameKeys.forEach((cnk) => {         
          if (id.includes(cnk) === true) {
            let posData = tpl.indexOf("{{")
            const objProperties = []
            while (posData > -1) {
              objProperties.push({
                name: tpl.substring(posData + 2, tpl.indexOf("}}") + 2),
                pos: posData,
              })
              posData = tpl.indexOf("{{", posData + 1)
            }
            template[cnk] = {
              tag: config.tag,
              template: tpl,
              name: cnk,
              properties: [...objProperties]
            }
            key = cnk
            console.log(template[cnk].properties)
          }
        })
        console.log(template)
        return {
          code: `
                 export const component = ${JSON.stringify(Object.assign({}, {...template[key]}))};
                 console.log('entro EN CAT FILE', component);
              `,
          map: null, // provide source map if available
        }
      }
    },
    transformIndexHtml(html) {
      const bodyPos = html.indexOf('<body');
      console.log('CAT FILE::::::::::::', bodyPos)
      const closeScriptPos = html.indexOf('<script', bodyPos + 1)
      let indexHtml = html
      let bodyHTML = ''
      bodyHTML = html.substring(bodyPos, closeScriptPos)
      bodyHTML = bodyHTML.replace('<body>', '');
      console.log('CAT FILE::::::::::::', bodyHTML)
      const test = 'TEST'
      indexHtml = `
      ${transformTemplate(indexHtml, template, bodyHTML)}
      `
      return indexHtml;
    },
  }
}
