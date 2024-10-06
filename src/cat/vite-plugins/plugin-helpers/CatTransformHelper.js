import fs from 'fs';
import path from 'path';
import CatJoinTemplates from './CatJoinTemplates';
import CatJoinScripts from './CatJoinScripts';

class CatTransformHelper {
  constructor() {
    this.templateRegExp = /<template(.|[\s\S])*?<\/template>/g
    this.configRegExp = /<config>(.|[\s\S])*?<\/config>/g
    this.scriptRegExp = /<script(.|[\s\S])*?<\/script>/g
  }

  readAllFiles(dir, extension) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const filesObj = []
    for (const file of files) {
      if (file.isDirectory()) {
        this.readAllFiles(path.join(dir, file.name));
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
    return fs.readFileSync(path.join(`${srcPath}`),{ encoding: 'utf8', flag: 'r' })
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
  getScript(code, config) {
    const scripts = code.match(this.scriptRegExp);
    let returnValue = code;

    if (scripts !== null) {
      const joinScript = new CatJoinScripts(scripts)
      returnValue = joinScript.getScripts(scripts);
    }
    return scripts;
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