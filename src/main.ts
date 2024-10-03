import './main.css'
//import "@pjts-game/components/hello-world.cat";
import CatHooks from "@cat/cat-classes/CatHooks";
import PJTS from "@cat/index";
import CatPage from "@cat/cat-web-gaps-classes/CatPage";

class Game {
  hooks: CatHooks
  pjts: PJTS
  constructor() {
    this.hooks = CatHooks.instance
    this.hooks.addHook('cat-before-load', () =>{
      console.log('HOOK CAT BEFORE LOAD')
    })
    this.hooks.addHook('cat-after-load', () =>{
      console.log('HOOK CAT AFTER LOAD')
    })
    console.log('CONSTRUCTOR GAME')
    this.pjts = new PJTS()
    customElements.define("cat-page", CatPage);
  }
}
export default new Game();
