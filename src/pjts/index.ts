import CatApp from '@cat/index'

class PJTS {
  cat: CatApp
  constructor() {
    this.cat = CatApp.instance
    this.cat.client.catHooks.addHook('cat-after-load', (pages: any) => {
      // console.log(pages)
    })
  }
}

export default PJTS
