import path from "path";
import { v4 as uuidv4 } from "uuid";
import catTransformHelper from "./plugin-helpers/CatTransformHelper";

let pages = [];
const getPages = (options) => {
  const allPagesFiles = catTransformHelper.readAllFiles(
    path.normalize(`src/${options.pages.base}/${options.pages.path}`),
    ".html"
  );
  console.log(options.pages.path)
  allPagesFiles.forEach((id)=> {
    console.log(id)
    const data = catTransformHelper.getFileContent(`src/${options.pages.base}/${options.pages.path}/${id.name}.html`)
    const uuid = uuidv4();
    const route = id.name;
    const templateHTML = `${data}`;
    //  code = `export default 'HELLO WORLD'`
    pages[route] = {
      id: uuid,
      route,
      template: templateHTML,
    };
  })
  console.log(pages)
  return pages
}

const fileRegex = /main.ts$/;
const fileCatEndsWith = ".cat";
const fileHTMLEndsWith = ".html?special";
const templates = [];
let urlPage = "";
let htmlIndex = "";
let transformIndexState = "before";
export default function transformIndextemplate(options) {
  const virtualComponentsId = "virtual:components";
  const resolvedVirtualComponentId = "\0" + virtualComponentsId;
  const allPagesFiles = catTransformHelper.readAllFiles(
    path.normalize(`src/${options.pages.base}/${options.pages.path}`),
    ".html"
  );
  const allCatFiles = catTransformHelper.readAllFiles(
    path.normalize(`src/${options.components.base}/${options.components.path}`),
    ".cat"
  );
  let catFilesImports = "";
  let pagesFilesImports = "";
  let beforeExportCatFiles = `const arrayComponents = []
`;
  let beforeExportPagesFiles = `const arrayPages = []
`;
  let exports = ``;
  allPagesFiles.forEach((pf, index) => {
    pagesFilesImports += `import page${index} from "@pjts-game/${options.pages.path}/${pf.name}.html?special";
`;
    beforeExportPagesFiles += `arrayPages.push(page${index})
`;
  });
  allCatFiles.forEach((cf, index) => {
    console.log("CCCFFFF", cf);
    catFilesImports += `import component${index} from "@pjts-game/${options.components.path}/${cf.name}.cat";
`;
    beforeExportCatFiles += `arrayComponents.push(component${index})
`;
  });
  exports += `
    console.log('VIRTUAL COMPONENT CAT FILE', arrayPages)
    // helloWorld()
    export default {
      routes: arrayPages,
      components: arrayComponents,
    }
`;
  return {
    name: "vite-plugin-cat-transform", // required, will show up in warnings and errors
    resolveId: {
      handler(id) {
        if (id === virtualComponentsId) {
          return resolvedVirtualComponentId;
        }
      },
    },
    load: {
      handler(id) {
        if (id === resolvedVirtualComponentId) {
          return (
            pagesFilesImports +
            catFilesImports +
            beforeExportPagesFiles +
            beforeExportCatFiles +
            exports
          );
        }
      },
    },
    transform: {
      handler(src, id) {
        let code = src;
        console.log(id);
        if (id.endsWith(fileCatEndsWith) === true) {
          // console.log('TRANSFORM CAT FILE',id)
          const uuid = uuidv4();
          let catConfigComponent = {};
          try {
            catConfigComponent = JSON.parse(catTransformHelper.getConfig(code));
          } catch (e) {
            // console.error(`%c${e}`, 'color: red;')
            console.error(`\x1b[31m%s\x1b[0m`, e);
          }
          const catTemplateComponent = catTransformHelper
            .getTemplate(code)
            .replace("<template>", `<template cat-id="${uuid}">`);
          const tagName = catConfigComponent.tag;
          const tags = Object.keys(templates);
          if (tags.includes(tagName) === false) {
            templates[tagName] = new Map();
          }
          templates[tagName].set(uuid, catTemplateComponent);
          code = `const returnTemplate = \`${templates[tagName].get(uuid)}\`
                  export default {
                    id: '${uuid}',
                    template: returnTemplate,
                    tag: '${tagName}',
                    nameClass: 'Prova',
                    tagClass: 
                    class Prova extends HTMLElement {
                      constructor() {
                        super()
                        const template = this.querySelector('#template');
                        console.log('CONSTRUCTOR PROVA CLASS', template)
                        this.innerHTML = \`${templates[tagName].get(uuid).replace(`<template cat-id="${uuid}">`, "").replace("</template>", "")}\`
                      }
                    }
                  }
                `;
        } else if (id.endsWith(fileHTMLEndsWith) === true) {
          const uuid = uuidv4();
          const route = id.split("/").pop().replace(".html?special", "");
          const templateHTML = `${src}`;
          console.log(templateHTML);
          code = `const templateObj = {
                    id: '${uuid}',
                    template: \`${templateHTML}\`,
                    route: \`${route}\`
                  }
                    export default templateObj
                `;
          //  code = `export default 'HELLO WORLD'`
          pages[route] = {
            id: uuid,
            route,
            template: templateHTML,
          };
        }
        return {
          code: code,
          map: null, // provide source map if available
        };
      },
    },
    transformIndexHtml(html, ctx) {
      htmlIndex = html;
      if (ctx.server) {
        if (ctx.originalUrl && urlPage === "") {
          urlPage = ctx.originalUrl;
          htmlIndex = html.replace(
            '<meta charset="UTF-8" />',
            `<meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />`
          );
          pages = getPages(options)
          console.log(pages)
          let templateUrl = "index";
          return htmlIndex.replace(
            "<cat-page></cat-page>",
            `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`
          );
        } else if (urlPage !== "") {
          let routeUrl = urlPage.replace("/", "", "g");
          let templateUrl = "index";

          if (routeUrl !== "") {
            templateUrl = routeUrl;
          }
          return htmlIndex.replace(
            "<cat-page></cat-page>",
            `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`
          );
        }
      }
      let templateUrl = "index";
      return htmlIndex.replace(
        "<cat-page></cat-page>",
        `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`
      );
    },
  };
}
