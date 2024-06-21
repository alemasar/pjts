const pageWebComponentTemplate = (tpl: string) => `
import WebComponentSchema from '@framework/common/WebComponentSchema';

class MyTagExtendSchema extends WebComponentSchema {
  $text: any;

  constructor() {
    super();
  }
  initComponent() {
    this.$text = this.shadowDOM.querySelector('.tag');
  }

  template(tpl: string) {
    return \`
      ${tpl}
    \`;
  }

  templateCss() {
    return \`
      <style>
      </style>
    \`;
  }
  static defineCustomElements() {
    window.customElements.define('my-tag-extend-schema', MyTagExtendSchema);
  }
  /* mapComponentAttributes() {
    const attributesMapping = ['text'];
    attributesMapping.forEach((key: string) => {
      if (!this.attributes) {
        this.attributes[key] = { value: '' };
      }
    });
  } */
}

export default MyTagExtendSchema;
`
export default (tpl: string) => pageWebComponentTemplate(tpl);