import fs from 'fs';
import path from 'path';
import pageWebComponentTemplate from '../../src/framework/templates/PageWebComponent.template'
const fileRegex = /main.ts$/
const fileEndsWith = '.cat'
const templateRegExp = /<template>(.|\n)*?<\/template>/g

export function readAllFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const filesObj = []
  for (const file of files) {
    if (file.isDirectory()) {
      readAllFiles(path.join(dir, file.name));
    } else if (file.name.includes('.cat') === true) {
      filesObj.push({
        path: dir.replace('src/', ''),
        name: file.name.replace('.cat', '').trim()
      })
    }
  }
  return filesObj
}
const getTpl = (src) => {
  return src.match(templateRegExp)[0].replace(/\n/g, '').replace('<template>', '').replace('</template>', '')
  // pageWebComponentTemplate()
}
export default function myPlugin(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let imports = ''
  let exports = ''
  let template = ''
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
    async transform(src, id) {
      console.log('FILES:::::',id)
      if (fileRegex.test(id)) {
        // const component = await import('../../src/pjts/components/MyTagExtendSchema.cat?raw')
        console.log('MAIN FILE::::::::::::', template)
        // ${imports}
        const srcModified = `
                              import * as component from 'virtual:my-module'
                              ${src}
                              console.log(component)
                            `
        return {
          code: srcModified,
          map: null, // provide source map if available
        }
      } else if (id.endsWith(fileEndsWith)) {
        const tpl = getTpl(src).trim()
        template += tpl
        console.log('CAT FILE::::::::::::', template)
        return {
          code: `export const component = ${JSON.stringify(tpl)};
                 console.log('entro EN CAT FILE');
                `,
          map: null, // provide source map if available
        }
      }
    },
  }
}