import type { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { CatPageTransform } from "../core/cat-page-transform";
import { CatGapTransform } from "../core/cat-gap-transform";

const getAllPageFiles = (dir: string, baseDir: string = dir): string[] => {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      files.push(...getAllPageFiles(fullPath, baseDir));
    } else if (item.endsWith(".page") || item.endsWith(".cat")) {
      // Calculate relative path from pages directory and normalize to forward slashes
      const relativePath = path.relative(baseDir, fullPath);
      const normalizedPath = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes
      files.push(normalizedPath);
    }
  }
  
  return files;
};

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
        const catFiles = getAllPageFiles(gapsConfigPath);
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
        
        // Recursive function to find all .page files in directories and subdirectories       
        const pageFiles = getAllPageFiles(pagesPath);
        console.log('PAGE FILES', pageFiles);
        pageFiles.forEach((file, index) => {
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
        console.log('PASSO PER TRANSFORM', id);
        // Normalize path separators to forward slashes for consistent processing
        const normalizedId = id.replace(/\\/g, '/');
        let pathParts = normalizedId.split("/");
        let router = {};
        let filename = pathParts.shift();
        while(filename !== 'pages') {
          filename = pathParts.shift();
          console.log('FILENAME::::', filename);
        }
        console.log('PATH PARTS::::', pathParts.join("-").replace(".page",""));
        router = catPage.parser(pathParts.join("-").replace(".page","") || "", code);
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
