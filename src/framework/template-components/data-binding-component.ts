
import Observable from "@framework/common/Observable";
interface IDataBindings {
     [index: string]: Observable[];
}

interface IDataBindingsProperty {
     [index: string]: string[];
}
const dataBindings = {} as IDataBindings;

class DataBindingComponentElement extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    const shadowRoot = this.attachShadow({mode: 'open'});
    this.setAttribute('class', 'databinding-element');
    template.setAttribute('class', 'databinding');
    template.innerHTML = this.innerHTML
    this.appendChild(template);
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("Custom element added to page.", this.innerHTML);
    const bingdingIdArray = this.getAttribute('binding-id')?.split(':')
    const nameProperty = bingdingIdArray?.pop() as string;
    const nameComponent = bingdingIdArray?.pop() as string;
    const shadowRoot = this.shadowRoot as unknown as ShadowRoot;
    const observable = new Observable(shadowRoot.innerHTML);
    observable.subscribe((newValue: any) => {
      const templateHTML = this.querySelector('.databinding') as unknown as Element;
      shadowRoot.innerHTML = newValue;
      this.innerHTML = newValue;
      templateHTML.innerHTML = newValue;
      this.appendChild(templateHTML)
    })
    // this.setAttribute('data-component-id', index)
    const keysDatabindings = Object.keys(dataBindings);
    const key = `${nameComponent}:${nameProperty}`;
    if (keysDatabindings.includes(key) === false) {
      dataBindings[key]=[]
    }
    dataBindings[key].push(observable)
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
customElements.define("data-binding-component", DataBindingComponentElement);

const changePropertyByName = (component: string, name: any, value: any) => {
  const key = `${component}:${name}`
  const dataBindingsKeys = Object.keys(dataBindings);
  // VALIDACIO DE LES KEYS, QUE EXISTAN EN EL ARRAY DATABINDING
  if (dataBindingsKeys.includes(key) === true) {
    dataBindings[key].forEach((b: any) => {
      console.log('INDDEX::::::', key)
      b.value = value;
    })
  }
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
export const changeByObjectValue = changePropertyByObject