import "virtual:my-module";
import DataBindingComponentElement from "@framework/template-components/data-binding-component";
import Observable from "@framework/common/Observable";

customElements.define("data-binding-component", DataBindingComponentElement);
console.log(document.querySelectorAll('.databinding'));

const elementsToBinding = document.querySelectorAll('.databinding-element');
let dataBindings: any[] = []
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
  if (index === 0) {
    dataBindings[nameProperty]=[]
  }
  dataBindings[nameProperty].push(observable)
})
const changeProperty=(name: any, value: any) => {
  dataBindings[name].forEach((b: any, index:any) => {
    console.log('INDDEX::::::', name)
    b.value = value;
  })
}
setTimeout(()=> {
    changeProperty('hello.message', 'BYE.... BYE..... GUAY');
}, 1000)
