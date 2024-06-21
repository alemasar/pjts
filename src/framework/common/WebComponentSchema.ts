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
      ${this.template(this.attributes.item(0)?.value as string)}
    `;
  }

  // mapComponentAttributes() {}
  templateCss() {}
  template(tpl: string) {
    return `
      ${tpl}
    `;
  }
  initComponent() {}
}
export default WebComponentSchema;
