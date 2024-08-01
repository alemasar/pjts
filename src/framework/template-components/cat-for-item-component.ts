class CatForComponentElement extends HTMLElement {
  _root: any
  constructor() {
    super();
    const template = document.createElement('template');
    this._root = this.attachShadow({mode: 'closed'});
    this.setAttribute('class', 'databinding-element');
    template.setAttribute('class', 'databinding');
    template.innerHTML = this.innerHTML
    this.appendChild(template);
    this._root.appendChild(template.content.cloneNode(true));
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
customElements.define("cat-for-item-component", CatForComponentElement);
export default CatForComponentElement;
