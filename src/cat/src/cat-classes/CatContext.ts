 import { v4 as uuidv4 } from 'uuid';
 
 interface ICatGap{
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
  private _getGapIdById: Map<string, string>
  private _getRouteTemplateById: Map<string, string>
  private _getRouteIdById: Map<string, string>
  private _cat: {
    gaps: Map<string, ICatGap>
    routes: Map<string, IPageRoute>
    route: string
    routeId: string
  };

  private constructor() {
    this._cat = {
      gaps: new Map<string, ICatGap>(),
      routes: new Map<string, IPageRoute>(),
      route: 'index',
      routeId: '',
    }
    this._internalId = ''
    this._getTagById=new Map<string, string>()
    this._getGapIdById=new Map<string, string>()
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
  get gaps() {
    return this._cat.gaps
  }
  set gap(newValue: ICatGap) {
    this._internalId = uuidv4()
    this._getTagById.set(newValue.tag, this._internalId)
    this._getGapIdById.set(newValue.id, this._internalId)
  }
  get getComponentByTag() {
    return (tag: string) => {
      return this._cat.gaps.get(this._getTagById.get(tag) as string)
    }
  }
  get getGapById() {
    return (id: string) => {
      return this._cat.gaps.get(this._getGapIdById.get(id) as string)
    }
  }
  getRouteIdById(id: string) {
    // console.log(this._cat.gaps.get(this._getRouteIdById.get(id) as string))
    return this._cat.gaps.get(this._getRouteIdById.get(id) as string)
  }
  get routes() {
    return this._cat.routes
  }
  set route(newValue: IPageRoute) {
    this._internalId = uuidv4()
    // console.log('NEW VALUE IN CATCONTEXT', newValue)
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
      // console.log('getRouteNameByRoute in getRouteNameByRoute', route)
      const pathname = route.replace('/', '')
      // console.log(this._cat.routes)
      const idTemplate = this._getRouteTemplateById.get(pathname)
      // console.log('ID TEMPLATE IN GET ROUTEBYROUTE',this._cat.routes.get(idTemplate as string))

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
