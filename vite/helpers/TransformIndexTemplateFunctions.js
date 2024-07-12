import fs from 'fs';
import path from 'path';

class TransformIndexTemplateFunctions {
  constructor() {
    this.templateRegExp = /<template>(.|\n)*?<\/template>/g
    this.configRegExp = /<config>(.|\n)*?<\/config>/g
    this.scriptRegExp = /<script>(.|\n)*?<\/script>/g
  }

  setDataBindings(tag, componentNameKey, tpl, template) {
    let templateObj = {...template};
    const objProperties = {};
    let posData = tpl.indexOf("{{ data:");

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

      tpl = tpl.replaceAll(
        `{{ ${source}:${name}:${defaultValue} }}`,
        `<data-binding-component binding-id="${componentNameKey}:${name}">${JSON.parse(
          JSON.stringify(defaultValue)
        )}</data-binding-component>`
      );
      templateObj = {...this.setTemplateComponentObj(tag, componentNameKey, tpl)}
      templateObj.properties.push({...objProperties});
      posData = tpl.indexOf("{{ data:", posData + 1);
    }

    return {
      template: {...templateObj},
    }
  }

  setCatFor(tag, componentNameKey, tpl, template) {
    const templateObj = {...template};
    const objForProperties = [];
    let posTagClose = 0;
    let posFor = tpl.indexOf("cat-for=");
    const posIniTag = tpl.lastIndexOf("<", posFor);

    while (posFor > -1) {
      const tagFor = tpl.substring(posIniTag + 1, tpl.indexOf(">", posFor + 1)).trim()
      const tagName = tagFor.split(" ").shift().trim();
      posTagClose = this.getPosTagClose(posFor, tpl, tagName);
      posFor = tpl.indexOf("cat-for=", posFor + 1);
    }

    return {
      template: {...templateObj},
    }
  }
  
  getPosTagClose(posForTagName, tpl, tagName) {
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

  readAllFiles(dir) {
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

