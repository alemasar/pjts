class CatForComponentElement extends HTMLElement {
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

export default CatForComponentElement;
