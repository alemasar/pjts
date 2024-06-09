import Schema from '../framework/Schema';

class MyTagExtendSchema extends Schema {
  $text: any;
  constructor() {
    super();
  }
  initComponent() {
    this.$text = this.shadowDOM.querySelector('.tag');
  }

  template() {
    // ${this.attributes.text.value}
    return `
      <link rel="stylesheet" href="/src/main.css">
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
      <div class="tag">
        ${this.attributes.getNamedItem('text')?.value}
      </div>
    `;
  }

  templateCss() {
    return `
      <style>
      </style>
    `;
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
