import "virtual:my-module";
import DataBindingComponentElement from "@framework/template-components/data-binding-component";
import Observable from "@framework/common/Observable";

/* singleton.value = 'BYE BYE WORLD'

const parseComponentHTML = (html: string) => {
    singleton.subscribe((newValue) => {
      let templateHTML = html
      let pos = templateHTML.indexOf("{{ data:", 0)
      templateHTML = updateValue(templateHTML, pos, posFinal);
      console.log(html)
      document.body.innerHTML = document.body.innerHTML.replace(html, templateHTML);
    })

  console.log(html)
  let templateHTML = html
  let pos = templateHTML.indexOf("{{ data:", 0)
  while (pos > -1) {
    const posFinal = templateHTML.indexOf(" }}", pos + 1);
    templateHTML = updateValue(templateHTML, pos, posFinal); 
    console.log('DATA::::::::::::::', templateHTML);
    pos = templateHTML.indexOf("{{ data:", pos + 1)
  }
  return templateHTML;
} */
/* const originalHTML = document.body.innerHTML;
const hello = new Observable("Hello World");
const test = new Observable("Bye... Bye... World");

const updateValue = (html: string, posIni: number) => {
  const posFinal = html.indexOf(" }}", posIni + 1);
  console.log(posFinal)
  // return html.substring(0, posIni) + singleton.value + html.substring(posFinal + 3);
} */
customElements.define("data-binding-component", DataBindingComponentElement);

console.log(document.querySelectorAll('.databinding'));

const elementsToBinding = document.querySelectorAll('.databinding-element');
let bindings: any[] = []
elementsToBinding.forEach((dbe: any, index: number)=>{
  const nameProperty = dbe.getAttribute('binding-id')?.split(':').pop();
  const observable = new Observable(dbe.shadowRoot.innerHTML);
  console.log(dbe)
  observable.subscribe((newValue: any) => {
    const templateHTML = dbe.querySelector('.databinding');
    dbe.shadowRoot.innerHTML = newValue;
    dbe.innerHTML = newValue;
    templateHTML.innerHTML = newValue;
    dbe.appendChild(templateHTML)
  })
  dbe.setAttribute('data-component-id', index)
  if (Array.isArray(bindings[nameProperty]) === false) {
    bindings[nameProperty]=[]
  }
  bindings[nameProperty].push(observable)
})
const changeProperty=(name: string, value: any) => {
  bindings[name].forEach((b: any) => {
    b.value = value;
  })
}
setTimeout(()=> {
    changeProperty('hello', 'BYE.... BYE..... GUAY');
}, 1000)

/* const name = new Observable("john");
const lastName = new Observable("doe");
const country = new Observable("India");
name.subscribe(() => {
  document.body.innerHTML = myInfo(name.value, lastName.value, country.value);
})
lastName.subscribe(() => {
  document.body.innerHTML = myInfo(name.value, lastName.value, country.value);
})
country.subscribe(() => {
  document.body.innerHTML = myInfo(name.value, lastName.value, country.value);
}) */

// const componentKeys = Object.keys(component);
// document.body.innerHTML
// componentKeys.forEach((k: any) => {
  
  // console.log('COMPONENT:::::', component[k]);
  // console.log('TEMPLATE::::::::', parseComponentHTML(component[componentKeys[k]]))
  // console.log('TEMPLATE::::::::', parseComponentHTML(component[k]))
  /* singleton.subscribe((newValue) => {
    let templateHTML = component[k]
    let pos = templateHTML.indexOf("{{ data:", 0)
    while (pos > -1) {
      templateHTML = updateValue(templateHTML, pos);
      console.log(templateHTML)
      document.body.innerHTML = document.body.innerHTML.replace(component[k], templateHTML);
      pos = templateHTML.indexOf("{{ data:", pos + 1)
    }
  }) */
// })

// console.log(singleton.subscribe((newValue: any) => { return newValue }))
// singleton.subscribe((newValue: any) => {console.log('NEW VALUE INSIDE PAGE', newValue)})
// singleton.value = 'BYE BYE WORLD'

// console.log(document.body.innerHTML)

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
