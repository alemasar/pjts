import * as components from "virtual:my-module";
import { changeByNameValue, changeByObjectValue } from "@framework/template-components/data-binding-component";



console.log(components)

setTimeout(()=> {
    changeByNameValue('DemoFirstTag', 'hello.message', 'BYE.... BYE..... GUAY');
}, 1000)

setTimeout(()=> {
  changeByObjectValue('DemoFirstTag', {
    hello: {
      title: 'AMAZING TITLE',
      message: 'HELLO WORLD AGAIN..... GUAY'
    },
    bye: {
      message: 'BYE BYE AGAIN..... GUAY',
      footer: 'AMAZING FOOTER'
    }
  });
}, 2000)
