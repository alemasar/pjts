import fs from 'fs';
import path from 'path';
const fileRegex = /PJTS.ts$/

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
const transformSrc = (src) => {
  
}
export default function myPlugin(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const components = readAllFiles(`src/${options.components.base}/${options.components.path}`)
  let exports = ''
  let imports = ''
  let defines = ''
  components.forEach((cmp) => {
    const cmpName = cmp.name.trim()
    imports += `import ${cmpName} from "@${cmp.path.replace('\/', '/')}/${cmpName}.cat";`
    // exports += `export { default as ${cmp.name} } from "@/${cmp.path.replace('\/', '/')}/${cmp.name}.cat";`
    // imports += `import { ${cmpName} } from 'virtual:my-module';`
    // defines += `${cmpName}.defineCustomElements()`
  })
  // readAllFiles(`@/${options.components.base}/${options.components.path}`)
  // console.log()
  return {
    name: 'vite-plugin-add-components', // required, will show up in warnings and errors
    transform(src, id) {
      if (fileRegex.test(id)) {
        transformSrc(src)
        // ${imports}
        const srcModified = `
                              ${imports}
                              ${src}
                            `
        return {
          code: srcModified,
          map: null, // provide source map if available
        }
      }
    },
  }
}
