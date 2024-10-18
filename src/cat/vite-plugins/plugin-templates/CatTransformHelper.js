import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';
import CatJoinTemplates from './templates-helpers/CatJoinTemplates';
import CatJoinScripts from './scripts-helpers/CatJoinScripts';
import getGaps from './gaps-helpers/CatGapHelpers'
import deleteComments from './templates-helpers/CatTemplateHelper'

class CatTransformHelper {
  constructor() {
    this.templateRegExp = /<template(.|[\s\S])*?<\/template>/g
    this.configRegExp = /<config>(.|[\s\S])*?<\/config>/g
    this.scriptRegExp = /<script(.|[\s\S])*?<\/script>/g
    this.importIdRegExp = /"(.*)"/
    this.templates = ''
    this.scripts = ''
  }

  readAllFiles(dir, extension) {
    const files = readdirSync(dir, { withFileTypes: true });
    const filesObj = []
    for (const file of files) {
      if (file.isDirectory()) {
        this.readAllFiles(join(dir, file.name));
      } else if (file.name.includes(extension) === true) {
        filesObj.push({
          path: dir.replace('src/', ''),
          name: file.name.replace(extension, '').trim()
        })
      }
    }
    return filesObj
  }

  getFileContent(srcPath) {
    return readFileSync(join(`${srcPath}`),{ encoding: 'utf8', flag: 'r' })
  }

  getConfig(code) {
    const config = code.match(this.configRegExp)
    let returnValue = '';

    if (config !== null) {
      returnValue = JSON.parse(JSON.stringify(config[0].replace('<config>', '').replace('</config>', '')));
    } else {
      throw new Error(`The config of the gap can't be blank`)
    }
    return returnValue;
  }

  getGaps(config, code) {
    const templates = code.match(this.templateRegExp)
    let gaps = new Map()

    if (templates !== null) {
      gaps = getGaps(config, templates)
    } else {
      throw new Error(`There is no gap`)
    }

    return gaps
  }

  getScripts(config, code) {
    const scripts = code.match(this.scriptRegExp);
    
    this.scripts = code
    if (scripts !== null) {
      const joinScript = new CatJoinScripts(config, scripts)
      
      this.scripts = joinScript.scripts
    }/* else {
      returnValue.set('default', new Map())
      returnValue.get('default').set('default', `const event = new CustomEvent("cat-gap-loaded", { detail: { tag: '${config.tag}', route: 'default', id: 'default' } })
        document.dispatchEvent(event)
        `)
    } */
    return this.scripts
  }

  getTemplates(config, code, catGaps) {
    const gaps = catGaps.get(config.tag)
    const gapBody = []

    for (let [route, gap] of gaps) {
      if (gaps.has('default') === true) {
        gapBody.push(...gaps.get('default').get('template'))
      }
      if (route !== 'default') {
        for (let line of gap.get('gap')) {
          // console.log('LINE:::::', line)
          const idImport = this.importIdRegExp.exec(line)
          if (idImport !== null) {
            const templateImportRegExp = new RegExp(`(<template (#import-id\s*=\s*"${idImport[1]}").*>)`)
            const templateImportLine = templateImportRegExp.exec(code) 
            if (templateImportLine !== null) {
              const templateImportPos = templateImportLine.index
              const closeTemplate = '</template>'
              const template = code.substring(templateImportPos, code.indexOf(closeTemplate, templateImportPos + 1) + closeTemplate.length)
              gapBody.push(...deleteComments(template))
              
            }
          }
        }
      }
//      console.log('IMPORT::::', gapBody)
      catGaps.get(config.tag).get(route).set('template', [...gapBody])
      gapBody.splice(0)
    }

    return catGaps
  }
}

export default new CatTransformHelper()