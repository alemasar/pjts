class DataBindingComponentElement extends HTMLElement {
  static observedAttributes = ["color", "size"];

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

    // shadowRoot.appendChild(templateNodes);
    // this.shadowRoot.appendChild(templateNodes);
    // this.element = templateNodes
    /* this.observable = new Observable(this.innerHTML);
    this.observable.subscribe((element: any = this, newValue: string) => {*/
      /* const template = document.createElement('template');
      template.innerHTML = newValue
      // shadowRoot.innerHTML = newValue
      const templateNodes = template.content.cloneNode(true);
      // this.shadowRoot.appendChild(templateNodes);
      // this.element.innerHTML = this.shadowRoot.innerHTML;
      console.log("DataBindingComponentElement", this) */
/*      console.log(element)
      element.innerHTML = newValue;
    })*/
    console.log("Custom element added to page.", this.innerHTML);
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

export default DataBindingComponentElement;