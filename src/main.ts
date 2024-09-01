import './main.css'
//import "@pjts-game/components/hello-world.cat";
import elements from 'virtual:components'
import pjts from '@pjts-game/index'
import CatContext from '@cat/cat-classes/CatContext'
import CatHooks from '@cat/cat-classes/CatHooks'
//import { createHooks, HookCallback } from 'hookable'

class Game {
  context: CatContext
  hooks: CatHooks
  constructor() {
    this.context = CatContext.instance
    this.hooks = CatHooks.instance
    elements.components.forEach((c: any) => {
      this.context.component = c
    })
    elements.routes.forEach((p: any) => {
      this.context.route = p
    })
    console.log('CONSTRUCTOR GAME')
  }
  async init () {
    await pjts();
    // Do some more asynchronous operations if needed
  }
  static async build () {
    const game = new Game();
    await game.init();
    return game
  }
}
const api = await Game.build();
// pjts().then(async ()=>{

  // console.log('HELLO')
  /* instanceHooks.addHook('hello', (args:any) => {
    console.log('HELLO', args)
  })

  instanceHooks.addHook('hello', (args:any) => {
    console.log('WORLD', args)
  })
  // instanceHooks.unregisterHook('hello')
  instanceHooks.callHookName('hello', {
    hello: 'HELLO WORLD'
  }) */
// })

