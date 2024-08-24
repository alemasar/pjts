import Singleton from "@framework/common/generic/Singleton";
import CatHTMLElement from '@framework/common/generic/CatHTMLElement'

class Data {
  private _data: any;
  private _databindings: { [key: string]: Function };
  private _pages: { [key: string]: CatHTMLElement };
  id: any;

  public constructor() {
    this._data = {}
    this._pages = {}
    this._databindings =  {}
    // this._observers = new Array<IStringIndexedArray>()
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

  get data() {
    return this._data;
  }

  set data(value: any) {
    //console.log('DATA VALUE IN BEFORE SET:::::::::::', this._data)
    this._data = this.mergeObj(this._data, value);
    //console.log('DATA VALUE IN SET:::::::::::', this._data)
  }
 
  get pages() {
    return this._databindings;
  }

  setPages(idPage: string, page: CatHTMLElement) {
    console.log('DATA VALUE IN BEFORE SET:::::::::::', idPage)
    this._pages[idPage] = page
    //console.log('DATA VALUE IN SET:::::::::::', this._data)
  }
  
  get databindings() {
    return this._databindings;
  }

  setDataBinding(idDataBinding: string, subscribe: Function) {
    console.log('DATA VALUE IN BEFORE SET:::::::::::', idDataBinding)
    this._databindings[idDataBinding] = subscribe
    //console.log('DATA VALUE IN SET:::::::::::', this._data)
  }

  commit(id:string, obj: any, overwrite: boolean=true) {
    const dataSource = Singleton.instance
    dataSource.commit(this.id, {
      id,
      obj,
      overwrite,
    })
  }
  push() {
    const dataSource = Singleton.instance
    //console.log(this.id)
    dataSource.push({id: this.id})
  }
  pull(id: string) {
    //console.log("ENTRO EN DATA")
    const dataSource = Singleton.instance
    //console.log(dataSource.pull(this.id, id))
    // this.update(id)
    return dataSource.pull(this.id, id)
  }
  /* subscribe(idComponent: string, element:CatHTMLElement, handler: Function) {
    const dataBindingId = element.getAttribute('cat-data-id') as string
    if (this._observers.get(idComponent) === undefined) {
      this._observers.set(idComponent, {} as IStringIndexedArray)
    }
    console.log('element:::::::::::::::', element)
    this._observers.get(idComponent)[dataBindingId] = handler
    this._observers.get(idComponent).set(element.getAttribute('cat-data-id'), handler)
    const test = () => {
      handler()
    }
  } */
  /* update(idComponent: string) {
    const dataSource = Singleton.instance
    const pageId = this.id
    const observers = this._observers.get(idComponent)
console.log('OBSERVERS', observers)
    if (observers !== undefined) {
      const keys = Object.keys(observers)
      keys.forEach((k) => {
        observers[k](dataSource.pull(pageId, idComponent).hello)
      })
    }
  } */
  /**
   * Finally, any singleton can define some business logic, which can be
   * executed on its instance.
   */
  /* public existsElement(index: string) {
    const keysDatabindings = Object.keys(this._value);
    console.log('KEYS DATA BIDINGS', keysDatabindings)
    return keysDatabindings.includes(index)
  }
  public modifyElementValue(index: string, value: any) {
    if (this.existsElement(index) === true) {
      this._value[index].forEach((b: any) => {
        console.log('INDDEX::::::', b)
        b.value = value;
      })
    }
  }
  public addElement(index: string, element: Observable ) {
    console.log('EXISTS ELEMENT', this.existsElement(index))
    if (this.existsElement(index) === false) {
      this._value[index]=[]
    }
    this._value[index].push(element)
    console.log('VALUE SINGLETON :::::::::::::::::', this._value[index])
  }
  public deleteElement(index: string) {
    delete this._value[index]
  } */
}

// const singleton = Singleton.instance

export default Data
