import { changeByNameValue } from "@framework/template-components/data-binding-component";
import CatPage from "@framework/cat-page";

document.addEventListener('DOMContentLoaded', () => {
  customElements.define("cat-page", CatPage);
},false)

// document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('page-loaded', (event) => {
    console.log('PAGE LOADED EVENT:::::::::::', event)
    setTimeout(()=> {
      changeByNameValue('DemoFirstTag', 'hello.message', 'BYE.... BYE..... GUAY');
    }, 1000)
  }, false)
// },false)
