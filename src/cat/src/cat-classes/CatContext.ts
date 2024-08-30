 import { v4 as uuidv4 } from 'uuid';
 
 interface ICatComponent{
  id: string
  template: string
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
  };

  private constructor() {
    this._cat = {
      components: new Map<string, ICatComponent>(),
      routes: new Map<string, IPageRoute>(),
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
  get components() {
    /* return (id: string) => {
      return this._cat.components.get(id)
    } */
    return this._cat.components
  }
  set component(newValue: ICatComponent) {
    this._internalId = uuidv4()

    this._cat.components.set(this._internalId, {
      id: newValue.id,
      tag: newValue.tag,
      template: newValue.template,
    })
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
  get routes() {
    /* return (id: string) => {
      return this._cat.components.get(id)
    } */
    return this._cat.routes
  }
  set route(newValue: IPageRoute) {
    this._internalId = uuidv4()

    this._cat.routes.set(this._internalId, {
      id: newValue.id,
      route: newValue.route,
      template: newValue.template,
    })
    this._getRouteTemplateById.set(newValue.route, this._internalId)
    this._getRouteIdById.set(newValue.id, this._internalId)
  }
  get getRoutePageByRoute() {
    return (route: string) => {
      return this._cat.routes.get(this._getRouteTemplateById.get(route) as string)
    }
  }
  get getRoutePageById() {
    return (id: string) => {
      return this._cat.routes.get(this._getRouteIdById.get(id) as string)
    }
  }
  mergeObj(master: any, merge: any) {
    const masterKeys = Object.keys(master)
    const mergeKeys = Object.keys(merge)
    const obj: Record<string, any> = {...master}
    mergeKeys.forEach((mk) => {
      if (masterKeys.includes(mk) === true) {
        if (typeof master[mk] === 'object' && typeof merge[mk] === 'object') {
          obj[mk] = this.mergeObj(master[mk], merge[mk])
        } else {
          obj[mk] = {...master[mk], ...merge[mk]}
        }
      } else {
        obj[mk] = merge[mk]
      }
    })
    return obj
  }
}

export default CatContext
