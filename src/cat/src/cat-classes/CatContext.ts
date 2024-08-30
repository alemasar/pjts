 import { v4 as uuidv4 } from 'uuid';
 
 interface ICatComponent{
  id: string
  tag: string
  template: string
}

class CatContext {
  static #instance: CatContext;
  private _internalId: string
  private _getTagFromId: Map<string, string>
  private _getIdFromId: Map<string, string>
  private _cat: {
    components: Map<string, ICatComponent>
  };

  private constructor() {
    this._cat = {
      components: new Map<string, ICatComponent>()
    }
    this._internalId = ''
    this._getTagFromId=new Map<string, string>()
    this._getIdFromId=new Map<string, string>()
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
    this._getTagFromId.set(newValue.tag, this._internalId)
    this._getIdFromId.set(newValue.id, this._internalId)
  }
  get getComponentByTag() {
    return (tag: string) => {
      return this._cat.components.get(this._getTagFromId.get(tag) as string)
    }
  }
  get getComponentById() {
    return (id: string) => {
      return this._cat.components.get(this._getIdFromId.get(id) as string)
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
