// import Observable from "@framework/common/Observable";
// import singleton from "@framework/common/Singleton";

/* interface IDataBindingsProperty {
     [index: string]: string[];
} */

// const dataBindings = {} as IDataBindings;

class DataBindingComponentElement extends HTMLElement {
  _root: any;
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "closed" });
    // const template = document.createElement('template');
    this.setAttribute('class', 'databinding-element');
    // template.setAttribute('class', 'databinding');
    // template.innerHTML = this.innerHTML
    // this.appendChild(template);
    if (this.firstChild !== null) {
      const firstChilds = this.firstChild
      console.log(firstChilds)
      // firstChildS.forEach((fc) => {
      this._root.appendChild(firstChilds.cloneNode(true));
      // })
    }
  }

  connectedCallback() {
    /* const bingdingIdArray = this.getAttribute('binding-id')?.split(':')
    const nameProperty = bingdingIdArray?.pop() as string;
    const nameComponent = bingdingIdArray?.pop() as string; */
    // const shadowRoot = this.shadowRoot as unknown as ShadowRoot;
    const idBinding = this.getAttribute('binding-id') as string
    /* const observable = new Observable(this.innerHTML);
    
    observable.subscribe((newValue: any) => {
      console.log("ENTRO EN SUBSCRIBE")
      // const templateHTML = this.querySelector('.databinding') as unknown as Element;
      const textValue = document.createTextNode(newValue)
      this.innerHTML = ''
      this._root.innerHTML = ''
      this._root.appendChild(textValue.cloneNode(true));
      // this.innerHTML = newValue;
      // templateHTML.innerHTML = newValue;
      this.appendChild(textValue.cloneNode(true))
    }) */
    // this.setAttribute('data-component-id', index)
    // const key = `${nameComponent}:${nameProperty}`;
    // singleton.addElement(key, observable.value)
    console.log("Custom element added to page.", idBinding);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string) {
    console.log(`Attribute ${name} has changed.`);
  }


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