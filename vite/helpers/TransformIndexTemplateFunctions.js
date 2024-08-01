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
      `<cat-data-binding-component binding-id="${indexToReplace}">${JSON.parse(
        JSON.stringify(codeToReplace)
      )}</cat-data-binding-component>`
    );

    return tpl;
  }
  
  parseDataBinding(source, tag, componentNameKey, tpl, templateObj) {
    const objProperties = {};
    let returnTemplateObj = structuredClone(templateObj);
    let pattern = `{{ ${source}:`
    if (source === '') {
      pattern = `{{ `
    }
    let posData = tpl.indexOf(pattern);

    while (posData > -1) {
      const nameArray = tpl
        .substring(posData + 2, tpl.indexOf("}}", posData + 1))
        .trim()
        .split(":");
      let src = ''
      let name = ''
      let defaultValue = ''
      let id = []
      // nameArray.shift();
      if (source !== '') {
        src = nameArray.shift()
        name = nameArray.shift()
        id.push(source)
        id.push(name)
      } else {
        name = nameArray.shift()
        id.push(name)
      }
      if (nameArray.length > 0) {
        defaultValue = nameArray.shift();
        id.push(defaultValue)
      }
      objProperties.name = name;
      objProperties.source = src;
      console.log(id.join(':'))
      tpl = this.replaceCodeDataBinding(tpl, `${id.join(':')}`, `${componentNameKey}:${name}`, defaultValue)
      if (returnTemplateObj.properties.length === 0) {
        returnTemplateObj = {...this.setTemplateComponentObj(tag, componentNameKey, tpl)}
        returnTemplateObj.properties.push({...objProperties});
      } else {
        returnTemplateObj.properties.push({...objProperties});
        returnTemplateObj.template = tpl
      }
      console.log('RETURN TEMPLATE OBJ', returnTemplateObj)
      posData = tpl.indexOf(pattern, posData + 1);
    }
    return returnTemplateObj
  }

  setDataBindings(tag, componentNameKey, tpl, template) {
    let templateObj = {...template};

    templateObj = this.parseDataBinding('data', tag, componentNameKey, tpl, templateObj)
    templateObj = this.parseDataBinding('', tag, componentNameKey, templateObj.template, templateObj)
    // console.log('TEMPLATE OBJECT:::::::::::', templateObj)
    return {
      template: {...templateObj},
    }
  }
  
  replaceCodeCatFor(tpl, index, indexToReplace, codeToReplace) {
    tpl = tpl.replaceAll(
      `{{ ${index} }}`,
      `<cat-data-binding-component binding-id="${indexToReplace}">${JSON.parse(
        JSON.stringify(codeToReplace)
      )}</cat-data-binding-component>`
    );

    return tpl;
  }

  setCatFor(tag, componentNameKey, tpl, template) {
    const templateObj = structuredClone(template);
    const objForProperties = [];
    const catForPattern = 'cat-for="'
    const catForPatternLength = catForPattern.length
    let posTagClose = 0;
    let posFor = templateObj.template.indexOf(catForPattern);
    
    while (posFor > -1) {
      const posIniTag = templateObj.template.lastIndexOf("<", posFor);
      const tagCatFor = templateObj.template.substring(posIniTag + 1, templateObj.template.indexOf(">", posFor + 1)).trim()
      const tagName = tagCatFor.split(" ").shift().trim();
      let replaceCatForHTML = ''
      let replaceCatForHTMLItem = ''
      let template = ''

      posTagClose = this.getPosTagClose(templateObj.template, tagName);
      replaceCatForHTML = templateObj.template.substring(posIniTag, posTagClose);
      replaceCatForHTMLItem = templateObj.template.substring(templateObj.template.indexOf(">", posIniTag) + 1, posTagClose - tagName.length - 3)
      /* catForSentence = templateObj.template.substring(posFor + catForPatternLength, templateObj.template.indexOf('"', posFor + catForPatternLength))
      catForSentenceArray = catForSentence.split(':')
      console.log('DATA FOR SENTENCE ARRAY::::::::::', catForSentenceArray)
      dataName = catForSentenceArray.shift()
      dataName = dataName.substring(0, dataName.indexOf(' in')).trim()
      dataSource = dataName.substring(dataName.indexOf('in ') + 3).trim()
      dataArrayId = catForSentenceArray.shift()
      arrayCatFor = catForSentenceArray.shift().replace('[', '').replace(']', '').split(',').map((item) => item.replace(/'/gi, '').trim())
      arrayCatFor.forEach((value, index) => {
        replaceCatForHTMLParsed += replaceCatForHTMLItem.replaceAll(`{{ ${dataName} }}`, value)
      }) */
      // dataName = catForSentenceArray.shift()
      
      posFor = templateObj.template.indexOf(catForPattern, posFor + 1);
      template = templateObj.template.replaceAll(
        `${replaceCatForHTML}`,
        `<cat-for-component cat-for-id="${componentNameKey}:test">${JSON.parse(
          JSON.stringify(replaceCatForHTML)
        )}</cat-for-component>`
      );
      template = template.replaceAll(
        `${replaceCatForHTMLItem}`,
        `<cat-for-item-component cat-for-id="${componentNameKey}:test">${JSON.parse(
          JSON.stringify(replaceCatForHTMLItem)
        )}</cat-for-item-component>`
      );
      templateObj.template = template
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
