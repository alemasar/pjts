import "virtual:components";
import { changeByNameValue } from "@framework/template-components/data-binding-component";
import "@framework/cat-page";


document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('page-loaded', (event) => {
    console.log(event)
    setTimeout(()=> {
      changeByNameValue('DemoFirstTag', 'hello.message', 'BYE.... BYE..... GUAY');
    }, 1000)
  }, false)
},false)
