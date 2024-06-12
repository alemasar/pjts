/* interface IAttributesDictionary {
  [index: string]: string;
} */

class WebComponentSchema extends HTMLElement {
  shadowDOM: ShadowRoot;
  // attributes: HTMLElement;
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
    console.log(this.attributes.item(0)?.value);
  }

  disconnectedCallback() {
    this.remove();
  }

  connectedCallback() {
    // this.mapComponentAttributes();
    this.render();
    this.initComponent();
  }

  render() {
    this.shadowDOM.innerHTML = `
      ${this.templateCss()}
      ${this.template()}
    `;
  }

  // mapComponentAttributes() {}
  templateCss() {}
  template() {}
  initComponent() {}
}
export default WebComponentSchema;
