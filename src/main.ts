import './main.css'
//import "@pjts-game/components/hello-world.cat";
import elements from 'virtual:components'
import pjts from '@pjts-game/index'
import CatContext from '@cat/cat-classes/CatContext'

const catContextInstance = CatContext.instance
elements.components.forEach((c: any) => {
  catContextInstance.component = c
})


pjts().then(()=>{
  console.log('HELLO WORLD FROM MAIN', elements)
})

