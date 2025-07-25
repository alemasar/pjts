import type { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { CatPageTransform } from "../core/cat-page-transform";
import { CatGapTransform } from "../core/cat-gap-transform";

export default function pjts(): Plugin {
  const catPage = new CatPageTransform();
  const catGap = new CatGapTransform();

  return {
    name: "pjts",
    configResolved(config) {
      console.log("[pjts] Vite config resolved:", config.root);
    },
    resolveId(id) {
      if (id === "virtual:cat-files") {
        return id;
      }
      if (id === "virtual:page-files") {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === "virtual:cat-files") {
        let imports = "";
        let exports = `const virtualGaps = []
        `;
        const gapsConfigPath = path.resolve(process.cwd(), "pjts/gaps-config");
        const catFiles = fs
          .readdirSync(gapsConfigPath)
          .filter((file) => file.endsWith(".cat"));
        // .map(file => path.join(gapsConfigPath, file))

        catFiles.forEach((file, index) => {
          console.log(file);
          imports += `import cat${index} from "@gaps-config/${file}";
          `;
          exports += `virtualGaps.push(cat${index})
          `;
        });
        return `${imports}
          ${exports}
          export default virtualGaps`;
      }
      if (id === "virtual:page-files") {
        let imports = "";
        let exports = `const virtualPages = []
        `;
        const pagesPath = path.resolve(process.cwd(), "pjts/pages");
        const pageFiles = fs
          .readdirSync(pagesPath)
          .filter((file) => file.endsWith(".page"));

        pageFiles.forEach((file, index) => {
          console.log('VOY A IMPORTAR');
          imports += `import page${index} from "@pages/${file}";
          `;
          exports += `virtualPages.push(page${index})
          `;
          
        });
        return `${imports}
          ${exports}
          console.log(virtualPages)
          export default virtualPages`;
      }
      return null;
    },
    transform(code, id) {
      if (id.endsWith(".cat")) {
        const gap = catGap.parser(code);
        return `export default () => { console.log(${JSON.stringify(gap)}) }`;
      }
      if (id.endsWith(".page")) {
        console.log('PASSO PER TRANSFORM');
        const router = catPage.parser(id.split("/").pop() || "", code);
         /*for (let [key, value] of router.routes) {
            routes.push({
              path: key,
              template: value
            });
          }
          for (let [key, value] of router.templates) {
            templates.push({
              id: key,
              template: value
            });
          }*/
          /*return `
          export default {
            routes: ${JSON.stringify(routes)},
            templates: ${JSON.stringify(templates)}
          };
        `;*/
        return `
          export const routes = ${JSON.stringify(router.routes)};
          export const templates = ${JSON.stringify(router.templates)};
          export default { routes, templates };
        `;
      }
      return null;
    },
  };
}
