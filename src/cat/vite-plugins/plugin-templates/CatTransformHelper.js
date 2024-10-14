import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';
import CatJoinTemplates from './templates-helpers/CatJoinTemplates';
import CatJoinScripts from './scripts-helpers/CatJoinScripts';

class CatTransformHelper {
  constructor() {
    this.templateRegExp = /<template(.|[\s\S])*?<\/template>/g
    this.configRegExp = /<config>(.|[\s\S])*?<\/config>/g
    this.scriptRegExp = /<script(.|[\s\S])*?<\/script>/g
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
  getScript(options, code, config) {
    const scripts = code.match(this.scriptRegExp);
    let returnValue = new Map();

    if (scripts !== null) {
      const joinScript = new CatJoinScripts(scripts)
      returnValue = joinScript.getScripts(options, config, scripts);
    } else {
      returnValue.set('default', new Map())
      returnValue.get('default').set('default', `const event = new CustomEvent("cat-gap-loaded", { detail: { tag: '${config.tag}', route: 'default', id: 'default' } })
        document.dispatchEvent(event)
        `)
    }
    return returnValue;
  }
  getGap(code, config, scripts) {
    const templates = code.match(this.templateRegExp)
    let returnValue = code;

    const joinTemplate = new CatJoinTemplates(templates, config, scripts)
    if (templates !== null) {
      returnValue = joinTemplate.template;
    }
    return returnValue;
  }
}

export default new CatTransformHelper()