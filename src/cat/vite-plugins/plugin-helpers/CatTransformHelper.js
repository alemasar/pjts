import fs from 'fs';
import path from 'path';

class CatTransformHelper {
  constructor() {
    this.templateRegExp = /<template>(.|[\s\S])*?<\/template>/g
    this.configRegExp = /<config>(.|[\s\S])*?<\/config>/g
    this.scriptRegExp = /<script>(.|[\s\S])*?<\/script>/g
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
      throw new Error(`The config of the component can't be blank`)
    }
    return returnValue;
  }
  getTemplate(code) {
    const template = code.match(this.templateRegExp)
    let returnValue = '';
    // console.log('GET TEMPLATE', template)

    if (template !== null) {
      returnValue = template[0];
    }
    return returnValue;
  }
  getScript(code) {
    const script = code.match(this.scriptRegExp)
    let returnValue = '';
    // console.log('GET SCRIPT', script)

    if (script !== null) {
      returnValue = script[0];
    }
    return returnValue;
  }
}

export default new CatTransformHelper()