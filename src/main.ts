import "@framework/template-components/cat-data-binding-component";
// import Observable from "@framework/common/Observable"
import "@framework/template-components/cat-for-component";
import "@framework/template-components/cat-for-item-component";
import CatPage from "@framework/cat-page";

document.addEventListener('DOMContentLoaded', () => {
  customElements.define("cat-page", CatPage);
},false)
/* 
// document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('page-loaded', (event) => {
    console.log('PAGE LOADED EVENT:::::::::::', event)
    setTimeout(()=> {
      changeByNameValue('DemoFirstTag', 'hello.message', 'BYE.... BYE..... GUAY');
    }, 1000)
  }, false)
// },false) */

/* const data = Observable.observable({hello: {message: 'HELLO WORLD'}})

function print () {
  console.log(data.hello.message)
}

// outputs 'John' to the console
Observable.observe(print)

// does nothing
setTimeout(() => data.hello.message = 'BYE BYE WORLD', 100) */
