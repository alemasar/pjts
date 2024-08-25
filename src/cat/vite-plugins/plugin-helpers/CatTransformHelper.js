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
  getConfig(code) {
    const config = code.match(this.configRegExp)
    let returnValue = '';
    console.log('GET CONFIG', config)

    if (config !== null) {
      returnValue = JSON.parse(JSON.stringify(config[0].replace('<config>', '').replace('</config>', '')));
    }
    return returnValue;
  }
}

export default new CatTransformHelper()