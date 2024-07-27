import fs from 'fs';
import path from 'path';

class TransformIndexTemplateFunctions {
  constructor() {
    this.templateRegExp = /<template>(.|\n)*?<\/template>/g
    this.configRegExp = /<config>(.|\n)*?<\/config>/g
    this.scriptRegExp = /<script>(.|\n)*?<\/script>/g
  }

  getFileContents(src) {
    return fs.readFileSync(src, { encoding: 'utf8', flag: 'r' });
  }

  replaceCodeDataBinding(tpl, index, indexToReplace, codeToReplace) {
    tpl = tpl.replaceAll(
      `{{ ${index} }}`,
      `<data-binding-component binding-id="${indexToReplace}">${JSON.parse(
        JSON.stringify(codeToReplace)
      )}</data-binding-component>`
    );

    return tpl;
  }
  
  parseDataBinding(source, tag, componentNameKey, tpl, templateObj) {
    const objProperties = {};
    let returnTemplateObj = structuredClone(templateObj);
    let posData = tpl.indexOf(`{{ ${source}:`);

    while (posData > -1) {
      const nameArray = tpl
        .substring(posData + 2, tpl.indexOf("}}", posData + 1))
        .trim()
        .split(":");
      const source = nameArray.shift();
      const name = nameArray.shift();
      let defaultValue = ''
      if (nameArray.length > 0) {
        defaultValue = nameArray.shift();
      }
      objProperties.name = name;
      objProperties.source = source;

      tpl = this.replaceCodeDataBinding(tpl, `${source}:${name}:${defaultValue}`, `${componentNameKey}:${name}`, defaultValue)

      returnTemplateObj = {...this.setTemplateComponentObj(tag, componentNameKey, tpl)}
      returnTemplateObj.properties.push({...objProperties});
      posData = tpl.indexOf(`{{ ${source}:`, posData + 1);
    }
    return returnTemplateObj
  }

  setDataBindings(tag, componentNameKey, tpl, template) {
    let templateObj = {...template};

    templateObj = this.parseDataBinding('data', tag, componentNameKey, tpl, templateObj)

    return {
      template: {...templateObj},
    }
  }
  
  replaceCodeCatFor(tpl, index, indexToReplace, codeToReplace) {
    tpl = tpl.replaceAll(
      `{{ ${index} }}`,
      `<data-binding-component binding-id="${indexToReplace}">${JSON.parse(
        JSON.stringify(codeToReplace)
      )}</data-binding-component>`
    );

    return tpl;
  }

  setCatFor(tag, componentNameKey, tpl, template) {
    const templateObj = structuredClone(template);
    const objForProperties = [];
    let posTagClose = 0;
    let posFor = templateObj.template.indexOf("cat-for=");
    
    while (posFor > -1) {
      const posIniTag = templateObj.template.lastIndexOf("<", posFor);
      const tagFor = templateObj.template.substring(posIniTag + 1, templateObj.template.indexOf(">", posFor + 1)).trim()
      const tagName = tagFor.split(" ").shift().trim();
      posTagClose = this.getPosTagClose(templateObj.template, tagName);
      posFor = templateObj.template.indexOf("cat-for=", posFor + 1);
      console.log(templateObj.template.substring(posIniTag, posTagClose))
      // cat-for-component
    }

    return {
      template: {...templateObj},
    }
  }
  
  getPosTagClose(tpl, tagName) {
    let lastTagFound = false;
    let posCloseTagName = tpl.lastIndexOf(`</${tagName}>`);

    while(lastTagFound === false) {
      if (tpl.lastIndexOf(`</${tagName}>`, posCloseTagName - 1) > -1){
        posCloseTagName = tpl.lastIndexOf(`</${tagName}>`, posCloseTagName - 1);
        lastTagFound = true;
      }
    }
    return posCloseTagName + `</${tagName}>`.length ;
  }
  
  setTemplateComponentObj(tag, componentNameKey, tpl) {
    return {
      tag,
      template: tpl,
      name: componentNameKey,
      properties: [],
    }
  }

  readAllFiles(dir, extension) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const filesObj = []
    for (const file of files) {
      if (file.isDirectory()) {
        readAllFiles(path.join(dir, file.name));
      } else if (file.name.includes(extension) === true) {
        filesObj.push({
          path: dir.replace('src/', ''),
          name: file.name.replace(extension, '').trim()
        })
      }
    }
    return filesObj
  }

  getConfig(src) {
    const config = src.match(this.configRegExp);
    let returnValue = '';

    if (config !== null) {
      returnValue = JSON.parse(config[0].replace(/\n/g, '').replace('<config>', '').replace('</config>', ''));
    }
    return returnValue;
  }

  getTpl(src) {
    const tpl = src.match(this.templateRegExp);
    let returnValue = '';
    if (tpl !== null) {
      returnValue = tpl[0].replace(/\n/g, '').replace('<template>', '').replace('</template>', '').trim();
    }
    return returnValue;
  }

  getScriptTpl(src) {
    const scriptTpl = src.match(this.scriptRegExp);
    let returnValue = '';

    if (scriptTpl !== null) {
      returnValue = scriptTpl[0].replace('<script>', '').replace('</script>', '').trim();
    }
    return returnValue;
  }
}

export default new TransformIndexTemplateFunctions();

