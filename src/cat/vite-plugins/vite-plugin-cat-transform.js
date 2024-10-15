import {normalize} from "path";
import { v4 as uuidv4 } from "uuid";
import catTransformHelper from "./plugin-templates/CatTransformHelper";
import generateGap from './plugin-templates/gapTemplate'

/* let pages = [];
const getLayouts = (options) => {
  const allPagesFiles = catTransformHelper.readAllFiles(
    path.normalize(`src/${options.pages.base}/${options.pages.path}`),
    ".html"
  );

  allPagesFiles.forEach((id)=> {
    const data = catTransformHelper.getFileContent(`src/${options.pages.base}/${options.pages.path}/${id.name}.html`)
    const uuid = uuidv4();
    const route = id.name;
    const templateHTML = `${data}`;

    pages[route] = {
      id: uuid,
      route,
      template: templateHTML,
    };
  })
  return pages
} */

const fileRegex = /main.ts$/;
const fileCatEndsWith = ".cat";
const fileHTMLEndsWith = ".html?special";
const templates = [];
let urlPage = "";
let htmlIndex = "";
let transformIndexState = "before";
export default function transformIndextemplate(options) {
  const virtualGapsId = "virtual:gaps";
  const resolvedVirtualGapId = "\0" + virtualGapsId;
  const allLayoutsFiles = catTransformHelper.readAllFiles(
    normalize(`src/${options.pages.base}/${options.pages.path}`),
    ".html"
  );
  const allCatFiles = catTransformHelper.readAllFiles(
    normalize(`src/${options.gaps.base}/${options.gaps.path}`),
    ".cat"
  );
  let catFilesImports = "";
  let layoutsFilesImports = "";
  let beforeExportCatFiles = `const arrayGaps = []
`;
  let beforeExportLayoutsFiles = `const arrayLayouts = []
`;
  let exports = ``;
  allLayoutsFiles.forEach((l, index) => {
    layoutsFilesImports += `import layout${index} from "@pjts-game/${options.pages.path}/${l.name}.html?special";
`;
    beforeExportLayoutsFiles += `arrayLayouts.push(layout${index})
`;
  });
  allCatFiles.forEach((cf, index) => {
    catFilesImports += `import gap${index} from "@pjts-game/${options.gaps.path}/${cf.name}.cat";
`;
    beforeExportCatFiles += `arrayGaps.push(gap${index})
`;
  });

  exports += `
    export default {
      routes: arrayLayouts,
      gaps: arrayGaps,
    }
`;
  return {
    name: "vite-plugin-cat-transform", // required, will show up in warnings and errors
    resolveId: {
      handler(id) {
        if (id === virtualGapsId) {
          return resolvedVirtualGapId;
        }
      },
    },
    load: {
      handler(id) {
        if (id === resolvedVirtualGapId) {
          return (
            layoutsFilesImports +
            catFilesImports +
            beforeExportLayoutsFiles +
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
          // const uuid = uuidv4();
          let catConfigGap = {};
          try {
            catConfigGap = JSON.parse(catTransformHelper.getConfig(code));
          } catch (e) {
            // console.error(`%c${e}`, 'color: red;')
            console.error(`\x1b[31m%s\x1b[0m`, e);
          }
          const catScriptsGap = catTransformHelper.getScripts(catConfigGap, options, code)
          /* if (catScriptComponent !== null) {
            catScriptComponent.forEach((csc) => {
              scriptCodeString += csc
            })
          } */
          const catTemplatesGap = catTransformHelper.getTemplates(catConfigGap, code)
          const catGap = generateGap({
            className: catConfigGap.name + 'Gap',
            tagName: catConfigGap.tag,
            catTemplatesGap,
            catScriptsGap,
          })
          code = `${catGap}`;
        } else if (id.endsWith(fileHTMLEndsWith) === true) {
          const uuid = uuidv4();
          const route = id.split("/").pop().replace(".html?special", "");
          const templateHTML = `${src}`;
          code = `const templateObj = {
                    id: '${uuid}',
                    template: \`${templateHTML}\`,
                    route: \`${route}\`
                  }
                  export default templateObj
                `;
        }
        return {
          code: code,
          map: null, // provide source map if available
        };
      },
    },
    /* transformIndexHtml(html, ctx) {
      let htmlIndex = html;
      if (ctx.server) {
        console.log('ORIGINAL URL',ctx.originalUrl)
        if (ctx.originalUrl && urlPage === "") {
          urlPage = ctx.originalUrl.replace("/", "", "g");
          htmlIndex = html.replace(
            '<meta charset="UTF-8" />',
            `<meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />`
          );
          pages = getPages(options)
          let templateUrl = "index";
          if (urlPage !=='') {
            templateUrl = urlPage
          }
          // return htmlIndex
          urlPage = templateUrl
          return htmlIndex.replace(
            "<cat-page></cat-page>",
            `<cat-page cat-route="${templateUrl}" cat-route-id="${pages[templateUrl].id}">${pages[templateUrl].template}</cat-page>`
          );
        } else if (urlPage !== "") {
          let routeUrl = urlPage;
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
      return htmlIndex.replace(
            "<cat-page></cat-page>",
            `<cat-page cat-route="foo" cat-route-id="3">HOLA</cat-page>`
          );
    },*/
  }; 
}
