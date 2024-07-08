import fs from 'fs';
import path from 'path';

const templateRegExp = /<template>(.|\n)*?<\/template>/g
const configRegExp = /<config>(.|\n)*?<\/config>/g

export const readAllFiles = (dir) => {
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
export const getConfig = (src) => {
  return JSON.parse(src.match(configRegExp)[0].replace(/\n/g, '').replace('<config>', '').replace('</config>', ''))
}
export const getTpl = (src) => {
  return src.match(templateRegExp)[0].replace(/\n/g, '').replace('<template>', '').replace('</template>', '').trim()
  // pageWebComponentTemplate()
}
export const setTemplateConfigObj = (tag, componentNameKey, tpl) => {
  return {
    tag,
    template: tpl,
    name: componentNameKey,
    properties: [],
  }
}

const getPosTagClose = (posForTagName, tpl, tagName) =>{
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

export const setCatFor = (tag, componentNameKey, tpl, template) => {
  const templateObj = {...template};
  const objForProperties = [];
  let posTagClose = 0;
  let posFor = tpl.indexOf("cat-for=");
  const posIniTag = tpl.lastIndexOf("<", posFor);

  if (posFor === -1) {
    console.log(templateObj)
    // templateObj[componentNameKey].forProperties = [...objForProperties];
  } else {
    while (posFor > -1) {
      const tagFor = tpl.substring(posIniTag + 1, tpl.indexOf(">", posFor + 1)).trim()
      const tagName = tagFor.split(" ").shift().trim();
      posTagClose = getPosTagClose(posFor, tpl, tagName);
      posFor = tpl.indexOf("cat-for=", posFor + 1);
    }
          console.log('TAG FOR', tpl.substring(posIniTag, posTagClose))
  }
  return {
    template: {...templateObj},
  }
}

export const setDataBindings = (tag, componentNameKey, tpl, template) => {
  let templateObj = {...template};
  const objProperties = {
    
  };
  let posData = tpl.indexOf("{{ data:");

  while (posData > -1) {
    const nameArray = tpl
      .substring(posData + 2, tpl.indexOf("}}", posData + 1))
      .trim()
      .split(":");
    const type = nameArray.shift();
    const name = nameArray.shift();
    let defaultValue = ''
    if (nameArray.length > 0) {
      defaultValue = nameArray.shift();
    }
    objProperties.name = name;
    console.log(`{{ ${type}:${name}:${defaultValue} }}`)
    tpl = tpl.replaceAll(
      `{{ ${type}:${name}:${defaultValue} }}`,
      `<data-binding-component binding-id="${componentNameKey}:${name}">${JSON.parse(
        JSON.stringify(defaultValue)
      )}</data-binding-component>`
    );
    templateObj = {...setTemplateConfigObj(tag, componentNameKey, tpl)}
    templateObj.properties.push({...objProperties});
    posData = tpl.indexOf("{{ data:", posData + 1);
  }

  return {
    template: {...templateObj},
  }
}
export const transformTemplate = (tpl, template, bodyHTML) => {
  const templateElementsValues = Object.values(template)
  let indexHtml = tpl

  templateElementsValues.forEach((element) => {
    while (new RegExp(`<${element.tag}`).test(indexHtml) === true) {
      const iniPointTag = new RegExp(`<${element.tag}`).exec(indexHtml).index
      const endPointTag = new RegExp(`</${element.tag}>`).exec(indexHtml).index
      const codeToReplace = indexHtml.slice(iniPointTag, endPointTag + element.tag.length + 3)
      indexHtml = indexHtml.replaceAll(codeToReplace, template[element.name].template)
    }
  })
  indexHtml = indexHtml.replace('</body>', `<template id="indexTemplate">${bodyHTML}</template>`)
  return indexHtml
}
