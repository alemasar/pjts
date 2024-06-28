import { readAllFiles, getConfig, getTpl, transformTemplate } from "../helpers/TransformIndexTemplateHelper"

const fileRegex = /main.ts$/
const fileEndsWith = '.cat'

export default function transformIndextemplate(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let template = []
  let contDataBinding = 0;
  let imports = ''
  let exports = ''
  let pageTemplate = ''
  console.log(`src/${options.components.base}/${options.components.path}`)
  const components = readAllFiles(`src/${options.components.base}/${options.components.path}`)
  console.log(components)
  components.forEach((cmp) => {
    const cmpName = cmp.name.trim()
    imports += `import { ${cmpName} } from "@pjts/${options.components.path}/${cmpName}.cat";\n`
    exports += `
      import * as ${cmpName} from "@pjts/${options.components.path}/${cmpName}.cat";

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
                            `
        return {
          code: srcModified,
          map: null, // provide source map if available
        }
      } else if (id.endsWith(fileEndsWith) === true) {
        
        const config = getConfig(src);
        const cmpNameKeys = Object.keys(template);
        let tpl = getTpl(src);
        let key = '';
        cmpNameKeys.forEach((cnk) => {         
          if (id.includes(cnk) === true) {
            let posData = tpl.indexOf("{{");
            const objProperties = [];
            if (posData === -1) {
              template[cnk] = {
                tag: config.tag,
                template: tpl,
                name: cnk,
                properties: [...objProperties],
              };
              key = cnk;
            }
            while (posData > -1) {
              const nameArray = tpl
                .substring(posData + 2, tpl.indexOf("}}", posData + 1))
                .trim()
                .split(":");
              const type = nameArray.shift();
              const name = nameArray.shift();
              const defaultValue = nameArray.shift();
              objProperties.push({
                name,
                pos: posData,
              })
              console.log('CAT FILE:::::::::::::::::::', contDataBinding)
              tpl = tpl.replaceAll(
                `{{ ${type}:${name}:${defaultValue} }}`,
                `<data-binding-component binding-id="${cnk}:${name}">${JSON.parse(
                  JSON.stringify(defaultValue)
                )}</data-binding-component>`
              );
              contDataBinding++;
              template[cnk] = {
                tag: config.tag,
                template: tpl,
                name: cnk,
                properties: [...objProperties],
              };
              key = cnk;
              posData = tpl.indexOf("{{", posData + 1);
            }
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
