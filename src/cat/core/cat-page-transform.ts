import { v4 as uuidv4 } from 'uuid';
import type { Page, Route, Template } from '../cat-vite-plugin/types/pages';
import { extractAllTags } from './utils/utils-parser-functions';


export class CatPageTransform {

  constructor() {

  }
  private setRoutePath(name: string, page: string): Page {
    const id = uuidv4();
    const routes: Route = {
      id: "",
      path: ""
    };
    const templates: Template = {
      id: "",
      template: ""
    };
    // const router = CatRouter.getInstance();
    const configMatch = page.match(/<config>\s*({[\s\S]*?})\s*<\/config>/);
    const templateMatch = extractAllTags(page, "template");

    if (configMatch) {
      try {
        const config = JSON.parse(configMatch[1]);
        
        // If config has route parameter, add it to CatRouter
        if (config.route) {
          //router.addRoute(id, config.route);
          routes.id = id;
          routes.path = config.route;

        }
      } catch (error) {
        console.error('Error parsing config JSON:', error);
      }
    } else {
      // router.addRoute(id, name.replace(".page", ""));
      routes.id = id;
      routes.path = name.replace(".page", "");
    }
    // console.log(page)
    //console.log(templateMatch[0])
    if (templateMatch.length > 0) {
      // const template = templateMatch[1];
      // router.addTemplate(id, templateMatch.trim());
      console.log(templateMatch[0].replace(/<template>/g, "").replace(/<\/template>/g, ""))
      templates.id = id;
      templates.template = templateMatch[0].replace(/<template>/g, "").replace(/<\/template>/g, "") 
    } else {
      console.error('Error the template don\'t has <template> tag.');
    }
    return {
      routes,
      templates
    };
  }

  public parser(name: string, page: string): Page {
    const router = this.setRoutePath(name, page);
    return router;
  }
} 