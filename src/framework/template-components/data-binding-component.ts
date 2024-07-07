
import Observable from "@framework/common/Observable";
interface IDataBindings {
     [index: string]: Observable;
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
    const nameProperty = this.getAttribute('binding-id')?.split(':').pop() as string;
    const shadowRoot = this.shadowRoot as unknown as ShadowRoot;
    const observable = new Observable(shadowRoot.innerHTML);
    console.log(this)
    observable.subscribe((newValue: any) => {
      const templateHTML = this.querySelector('.databinding') as unknown as Element;
      shadowRoot.innerHTML = newValue;
      this.innerHTML = newValue;
      templateHTML.innerHTML = newValue;
      this.appendChild(templateHTML)
    })
    // this.setAttribute('data-component-id', index)
    const keysDatabindings = Object.keys(dataBindings);

    if (keysDatabindings.includes(nameProperty) === false) {
      dataBindings[nameProperty]=[]
    }
    dataBindings[nameProperty].push(observable)
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`Attribute ${name} has changed.`);
  }


}
customElements.define("data-binding-component", DataBindingComponentElement);

const changeProperty = (name: any, value: any) => {
  dataBindings[name].forEach((b: any, index:any) => {
    console.log('INDDEX::::::', name)
    b.value = value;
  })
};

export default changeProperty