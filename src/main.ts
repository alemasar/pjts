import './main.css'
//import "@pjts-game/components/hello-world.cat";
import component from 'virtual:components'
import pjts from '@pjts-game/index'

pjts().then(()=>{
  console.log('HELLO WORLD FROM MAIN', component)
})

