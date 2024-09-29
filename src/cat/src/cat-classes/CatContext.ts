 import { v4 as uuidv4 } from 'uuid';
 
 interface ICatComponent{
  id: string
  tag: string
}

interface IPageRoute{
  id: string
  template: string
  route: string
}

class CatContext {
  static #instance: CatContext;
  private _internalId: string
  private _getTagById: Map<string, string>
  private _getComponentIdById: Map<string, string>
  private _getRouteTemplateById: Map<string, string>
  private _getRouteIdById: Map<string, string>
  private _cat: {
    components: Map<string, ICatComponent>
    routes: Map<string, IPageRoute>
    route: string
    routeId: string
  };

  private constructor() {
    this._cat = {
      components: new Map<string, ICatComponent>(),
      routes: new Map<string, IPageRoute>(),
      route: 'index',
      routeId: '',
    }
    this._internalId = ''
    this._getTagById=new Map<string, string>()
    this._getComponentIdById=new Map<string, string>()
    this._getRouteTemplateById=new Map<string, string>()
    this._getRouteIdById=new Map<string, string>()
  }

  public static get instance(): CatContext {
      if (!CatContext.#instance) {
          CatContext.#instance = new CatContext();
      }

      return CatContext.#instance;
  }
  get cat() {
    return this._cat
  }
  get components() {
    return this._cat.components
  }
  set component(newValue: ICatComponent) {
    this._internalId = uuidv4()

    /* this._cat.components.set(this._internalId, {
      id: newValue.id,
      tag: newValue.tag,
      template: newValue.template,
    }) */
   console.log(newValue)
    this._getTagById.set(newValue.tag, this._internalId)
    this._getComponentIdById.set(newValue.id, this._internalId)
  }
  get getComponentByTag() {
    return (tag: string) => {
      return this._cat.components.get(this._getTagById.get(tag) as string)
    }
  }
  get getComponentById() {
    return (id: string) => {
      return this._cat.components.get(this._getComponentIdById.get(id) as string)
    }
  }
  getRouteIdById(id: string) {
    console.log(this._cat.components.get(this._getRouteIdById.get(id) as string))
    return this._cat.components.get(this._getRouteIdById.get(id) as string)
  }
  get routes() {
    return this._cat.routes
  }
  set route(newValue: IPageRoute) {
    this._internalId = uuidv4()
    console.log('NEW VALUE IN CATCONTEXT', newValue)
    this._cat.routes.set(this._internalId, {
      id: newValue.id,
      route: newValue.route,
      template: newValue.template,
    })
    this._getRouteTemplateById.set(newValue.route, this._internalId)
    this._getRouteIdById.set(this._internalId, newValue.id)
  }
  get getRouteNameByRoute() {
    return (route: string) => {
      console.log('getRouteNameByRoute in getRouteNameByRoute', route)
      const pathname = route.replace('/', '')
      console.log(this._cat.routes)
      const idTemplate = this._getRouteTemplateById.get(pathname)
      console.log('ID TEMPLATE IN GET ROUTEBYROUTE',this._cat.routes.get(idTemplate as string))
      return this._cat.routes.get(idTemplate as string)
    }
  }
  get getRouteTemplateById() {
    return (id: string) => {
      return this._cat.routes.get(this._getRouteIdById.get(id) as string)
    }
  }
}

export default CatContext
