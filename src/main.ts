import './main.css'
//import "@pjts-game/components/hello-world.cat";
import elements from 'virtual:components'
import pjts from '@pjts-game/index'
import CatContext from '@cat/cat-classes/CatContext'
import CatHooks from '@cat/cat-classes/CatHooks'
//import { createHooks, HookCallback } from 'hookable'

const catContextInstance = CatContext.instance
elements.components.forEach((c: any) => {
  catContextInstance.component = c
})
elements.routes.forEach((p: any) => {
  catContextInstance.route = p
})

pjts().then(async ()=>{
  const instanceHooks = CatHooks.instance

  instanceHooks.addHook('hello', () => {
    console.log('HELLO')
  })

  instanceHooks.addHook('hello', () => {
    console.log('WORLD')
  })
  instanceHooks.unregisterHook('hello')
  instanceHooks.callHookName('hello')
  // Create a hookable instance
  /* const hooks = createHooks()
  const unregister = new Map<string, HookCallback>()
  // Hook on 'hello'
  unregister.set('hello', hooks.hook('hello', () => { console.log('Hello World' )}))
  
  const callback = unregister.get('hello') as HookCallback
  callback()
  // Call 'hello' hook
  hooks.callHook('hello') */
})

