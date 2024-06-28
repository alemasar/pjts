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

const parseTpl=(tpl) => {
  let templateHTML = tpl
  let pos = templateHTML.indexOf("{{ data:", 0)
  while (pos > -1) {
    const dataProperty = templateHTML.substring(pos, templateHTML.indexOf("}}", pos + 1)+2)
    const dataPropertyValue = dataProperty.replace("{{", "").replace("}}", "").trim().split(":").pop();
    templateHTML = templateHTML.replace(dataProperty, '${singleton.subscribe((newValue) => newValue)}')
    console.log('DATA::::::::::::::', JSON.parse(dataPropertyValue))
    pos = templateHTML.indexOf("{{ data:", 0)
  }
  return templateHTML;
}

export const transformTemplate = (tpl, template, bodyHTML) => {
  const templateElementsValues = Object.values(template)
  let indexHtml = tpl
  console.log(templateElementsValues)
  templateElementsValues.forEach((element) => {
    while (new RegExp(`<${element.tag}`).test(indexHtml) === true) {
      const iniPointTag = new RegExp(`<${element.tag}`).exec(indexHtml).index
      const endPointTag = new RegExp(`</${element.tag}>`).exec(indexHtml).index
      const codeToReplace = indexHtml.slice(iniPointTag, endPointTag + element.tag.length + 3)
      indexHtml = indexHtml.replaceAll(codeToReplace, template[element.name].template)
    }
  })
  indexHtml = indexHtml.replace('</body>', `<template id="indexTemplate">${bodyHTML}</template>`)
  console.log(indexHtml)
  return indexHtml
}
