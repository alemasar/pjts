import "virtual:components";
import "@framework/template-components/cat-data-binding-component";
// import Observable from "@framework/common/Observable"
import "@framework/template-components/cat-for-component";
import "@framework/template-components/cat-for-item-component";
import CatPage from "@framework/cat-page";
// import Singleton from "@framework/common/Singleton"
document.addEventListener('DOMContentLoaded', () => {
  customElements.define("cat-page", CatPage);
  /* document.querySelectorAll('[cat-data-id]').forEach((cdi)=>{
    console.log(cdi.querySelectorAll('[cat-data-id]')[0].children)
    const childs = cdi.querySelectorAll('[cat-data-id]')[0].children
    let count = 0

    while(childs.item(count)) {
      let child = childs.item(count)
      console.log(child)
      count++
    }
  }) */
},false)
/* const singleton = Singleton.instance
singleton.value = {
  hello: {
    message: 'HELLO WORLD',
    obj: {
      bye: 'MORE HELLO WORLD',
    }
  }
}


const get = (target: any, key: string) => {
  console.log('KEY FUERA PROXY', key)
  // return Reflect.get(target[key], key, receiver)
  return singleton.value[key]
}
let proxy = new Proxy({}, {get})


singleton.value = {
  hello: {
    title: 'AMAZING TITLE',
    obj: {
      more: 'MORE AMAZING TITLE',
    }
  }
}

console.log(proxy.hello.obj.more)
*/

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
