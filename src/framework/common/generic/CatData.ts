import Singleton from "@framework/common/generic/Singleton";

class Data {
  private _data: any;
  id: any;

  public constructor() {
    this._data = {}
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
  set data(value: any) {
    console.log('DATA VALUE IN BEFORE SET:::::::::::', this._data)
    this._data = this.mergeObj(this._data, value);
    console.log('DATA VALUE IN SET:::::::::::', this._data)
  }

  get data() {
      return this._data;
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
    console.log(this.id)
    dataSource.push({id: this.id})
  }
  pull(id: string) {
    console.log("ENTRO EN DATA")
    const dataSource = Singleton.instance
    console.log(dataSource.pull(this.id, id))
    return dataSource.pull(this.id, id)
  }
  /* subscribe(idDataBinding: string, idComponent:string, handler: any) {

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
