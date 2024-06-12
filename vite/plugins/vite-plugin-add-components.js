import fs from 'fs';
import path from 'path';
const fileRegex = /main.ts$/

export function readAllFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const filesObj = []

  for (const file of files) {
    if (file.isDirectory()) {
      readAllFiles(path.join(dir, file.name.replace('.ts', '')));
    } else {
      filesObj.push({
        path: dir.replace('src/', ''),
        name: file.name.replace('.ts', '')
      })
    }
  }
  return filesObj
}

export default function myPlugin(options) {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const components = readAllFiles(`src/${options.components.base}/${options.components.path}`)
  let exports = ''
  let imports = ''
  let defines = ''
  components.forEach((cmp) => {
    exports += `export { default as ${cmp.name} } from "@/${cmp.path.replace('\/', '/')}/${cmp.name}";`
    imports += `import { ${cmp.name} } from 'virtual:my-module';`
    defines += `${cmp.name}.defineCustomElements()`
  })
  // readAllFiles(`@/${options.components.base}/${options.components.path}`)
  // console.log()
  return {
    name: 'vite-plugin-add-components', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return exports
      }
    },
    transform(src, id) {
      if (fileRegex.test(id)) {
        const srcModified = `
                              ${imports}
                              ${defines}
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