import CatHTMLElement from '@framework/common/generic/CatHTMLElement'
// import Observable from "@framework/common/Observable"
// import singleton from "@framework/common/Singleton"

// import Observable from "@framework/common/Observable";
// import singleton from "@framework/common/Singleton";

/* interface IDataBindingsProperty {
     [index: string]: string[];
} */

// const dataBindings = {} as IDataBindings;

const getObjString = (objArray: string[], objStringParsed: string, defaultValue: any) => {
  let objString = objStringParsed
  if (objArray.length > 0) {
    const key = objArray.shift()
    // console.log('KEY OBJ STRING::::::::::::', key)
    // getObjString(objArray, objString, defaultValue)
    objString += '{"' + key +'": ' + getObjString(objArray, objString, defaultValue) + '}'
  } else {
    objString += defaultValue
  }
  return objString
}

/* const parseObjToJSONString = (objString: string, defaultValue: any) => {
  const objArray = objString.split(".")
  let returnStringObj = ''

  returnStringObj = getObjString(objArray, '', defaultValue)
  return returnStringObj
} */

const getObj = (keys: string[], obj: any) => {
  let objString = obj
  let returnObj = objString
  let returnValue = null
  let key: string =''

  if (keys.length > 0) {
    key = keys.shift() as string
    if (objString[key]) {
      returnObj = getObj(keys, objString[key]) as unknown as object
      returnValue = returnObj
    }
  }
  return returnValue
}

/* const getDataObjValue = (obj: any, property: any) => {
  const keysArray = property.split('.')
  let returnObject = {}

  returnObject = getObj(keysArray, obj)
  console.log('OBJECT::::::::::', returnObject)
  return returnObject
} */

class DataBindingComponentElement extends CatHTMLElement {
  nameProperty: string
  constructor() {
    super();
    const source = this.getAttribute('binding-source') as string
    this.nameProperty = ''
    if (source === 'data') {
      const bindingId = this.getAttribute('binding-id') as string
      const bingdingIdArray = bindingId.split(':')
      this.nameProperty = bingdingIdArray?.pop() as string;
      // const nameComponent = bingdingIdArray?.pop() as string;
      // const objString = parseObjToJSONString(this.nameProperty, this.innerHTML)
      // const text = getDataObjValue(singleton.value, this.nameProperty) as string
      

      // this._root = this.attachShadow({ mode: "closed" });
      // if (text === null) {
        /* singleton.value = Observable.observable(bindingId, JSON.parse(objString))
        Observable.observe(this.changeHTML.bind(this)) */
        // singleton.value = JSON.parse(objString)
        // console.log('SINGLETON VALUE:::::::::::', singleton.value)
        // console.log('HELLO MESSAGE VALUE:::::::::::', singleton.value.hello.message)
      // }
      // const template = document.createElement('template');
      // template.setAttribute('class', 'databinding');
      // template.innerHTML = this.innerHTML
      // this.appendChild(template);
      if (this.firstChild !== null) {
        const firstChilds = this.firstChild
        // console.log(firstChilds)
        // firstChildS.forEach((fc) => {
        this._root.appendChild(firstChilds.cloneNode(true));
        // })
      }
    }
  }

  connectedCallback() {
    CatHTMLElement.prototype.connectedCallback.call(this);
    /* const bingdingIdArray = this.getAttribute('binding-id')?.split(':')
    const nameProperty = bingdingIdArray?.pop() as string;
    const nameComponent = bingdingIdArray?.pop() as string; */
    // const shadowRoot = this.shadowRoot as unknown as ShadowRoot;
    // const idBinding = this.getAttribute('binding-id') as string
    /* const observable = new Observable(this.innerHTML);
    
    observable.subscribe() */
    // this.setAttribute('data-component-id', index)
    // const key = `${nameComponent}:${nameProperty}`;
    // singleton.addElement(key, observable.value)
    
    
    // console.log("Custom element added to page.", this.data);

  }
  changeHTML() {
    // const templateHTML = this.querySelector('.databinding') as unknown as Element;
    /* const text = getDataObjValue(singleton.value, this.nameProperty) as string
    const bindingId = this.getAttribute('binding-id') as string
    console.log('DATA::::::', bindingId)
    const textValue = document.createTextNode(text)
    this.innerHTML = ''
    this._root.innerHTML = ''
    this._root.appendChild(textValue.cloneNode(true));
    // this.innerHTML = newValue;
    // templateHTML.innerHTML = newValue;
    this.appendChild(textValue.cloneNode(true)) */
  }
  disconnectedCallback() {
    // console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    // console.log("Custom element moved to new page.");
  }

  /* attributeChangedCallback(name: string) {
    // console.log(`Attribute ${name} has changed.`);
  } */


}
customElements.define("cat-data-binding-component", DataBindingComponentElement);

/* const changePropertyByName = (component: string, name: any, value: any) => {
  const key = `${component}:${name}`
  singleton.modifyElementValue(key, value)
};

const parseKeysFromObjectToString = (obj: object, parentKey: string, returnKeys: IDataBindingsProperty) => {
  const keysToUpdate: IDataBindingsProperty = returnKeys;
  const entries = Object.entries(obj);
  console.log(entries)
  entries.forEach((entry) => {
    let key: string = `${parentKey}.${entry[0]}`;
    if (parentKey === '') {
      key = `${entry[0]}`
    }
    if (typeof entry[1] === 'object' && Array.isArray(entry[1]) === false) {
      parseKeysFromObjectToString(entry[1], key, keysToUpdate)
    } else {
      console.log('KEY', key)
    const keysDatabindings = Object.keys(keysToUpdate);

      if (keysDatabindings.includes(key) === false) {
        keysToUpdate[key] = []
      }
      keysToUpdate[key].push(entry[1])
    }
  })
  return keysToUpdate;
}

// TRANSFORMAR EL VALUE A KEYS PER DATABINDING SENSE ESTRUCTURA ARBRE
const changePropertyByObject = (component: string, value: object) => {
  if (typeof value === 'object' && Array.isArray(value) === false) {
    let changes: IDataBindingsProperty = parseKeysFromObjectToString(value, '', {});
    const entries = Object.entries(changes);

    entries.forEach((entry) => {
      changePropertyByName(component, entry[0], entry[1])
    })
  }
}

export const changeByNameValue = changePropertyByName
export const changeByObjectValue = changePropertyByObject */