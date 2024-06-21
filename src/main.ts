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
    // ${this.attributes.text.value}
    return `
      ${tpl}
    `;
  }

  templateCss() {
    return `
      <style>
      </style>
    `;
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
/* import typescriptLogo from '@/typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from '@/counter.ts';
import '@/main.css';
import observableSingleton from '@framework/common/Singleton';
import PJTS from '@pjts/PJTS'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
  <my-tag-extend-schema text="Hola" bla="bla"></my-tag-extend-schema>
`;
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
const name = new Observable("Jeremy");
name.subscribe((newVal: string) => console.log(`Name changed to ${newVal}`));
name.value = "Doreen";
const pjts = new PJTS();
console.log(component)
const singletonObserver = observableSingleton;
singletonObserver.subscribe((newVal: string) => console.log(`Singleton Value changed to ${newVal}`));
singletonObserver.value = 'hello '; */
