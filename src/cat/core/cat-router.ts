// cat-router.ts - Router logic for cat module will go here
import { v4 as uuidv4 } from 'uuid';

interface Parameter {
  name: string;
  value: string;
}

export class CatRouter {
  private static instance: CatRouter;
  private _routes: Map<string, any>;
  private _templates: Map<string, any>;
  private _parameters: Map<string, any>;
  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialization logic here
    this._routes = new Map<string, any>();
    this._parameters = new Map<string, any>();
    this._templates = new Map<string, any>();
  }

  // Public method to get the singleton instance
  public static getInstance(): CatRouter {
    if (!CatRouter.instance) {
      CatRouter.instance = new CatRouter();
    }
    return CatRouter.instance;
  }
  get routes(): Map<string, any> {
    return this._routes;
  }
  get parameters(): Map<string, any> {
    return this._parameters;
  }
  get templates(): Map<string, any> {
    return this._templates;
  }
  // Example method 
  public addRoute(routeId: string, path: string): void {
    // Routing logic here
    this._routes.set(path, routeId);
  }
  
  public addTemplate(templateId: string, template: string): void {
    // Routing logic here
    this._templates.set(templateId, template);
  }

  public addParameters(routeId: string, parameters: Parameter[]): void {
    // Routing logic here
    this._parameters.set(routeId, parameters);
  }

  // Get route ID by pathname
  public getRouteId(pathname: string): string | undefined {
    return this._routes.get(pathname);
  }

  // Get template by route ID
  public getTemplate(routeId: string): string | undefined {
    return this._templates.get(routeId);
  }
  // Get template by route ID
  public getParameters(routeId: string): Parameter[] | undefined {
    console.log('Parameters:', routeId);
    return this._parameters.get(routeId);
  }

  // Match a pathname to a route, supporting parameters (segments starting with '#')
  public getRouteTemplateName(path: string) {
    const routeTemplate = path.replace('/', '')
    let route = ''
    
    if (routeTemplate !== ''){
      const splittedCheckedPath = path.split('/')
      const pathnames = Array.from(this._routes.keys())

      splittedCheckedPath.shift()
      for (let pathname of pathnames) {
        const splittedPath = pathname.split('/')
        splittedPath.shift()
        if (splittedCheckedPath.length === splittedPath.length) {
          const parameters: Parameter[] = []
          let index = 0
          let samePath = true
          let sp = splittedPath[0]
          let scp = splittedCheckedPath[0]

          while(samePath === true && index < splittedPath.length) {
            if (sp.includes('#') === false && sp !== scp) {
              samePath = false
            } else if (sp.includes('#') === true) {
              parameters.push({
                name: sp.replace('#', ''),
                value: scp
              })
            }      
            index++
            sp = splittedPath[index]
            scp = splittedCheckedPath[index]
          }

          if (samePath === true) {
            route = this._routes.get(pathname)
            this.addParameters(route, parameters)
          }
        }
      }
    } else {
      route = this._routes.get('index')
    }

    return route
  }
}

export default CatRouter.getInstance();