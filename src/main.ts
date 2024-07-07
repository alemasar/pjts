import "virtual:my-module";
import changeProperty from "@framework/template-components/data-binding-component";

setTimeout(()=> {
    changeProperty('hello.message', 'BYE.... BYE..... GUAY');
}, 1000)

setTimeout(()=> {
    changeProperty('hello.message', 'HELLO WORLD AGAIN..... GUAY');
}, 2000)
