import type CatContext from '@cat/cat-classes/CatContext'
import type CatHooks from '@cat/cat-classes/CatHooks'
import elements from 'virtual:gaps'

class Client {
  context: CatContext
  catHooks: CatHooks
  constructor(context: CatContext, catHooks: CatHooks) {
    this.context = context
    this.catHooks = catHooks

    elements.gaps.forEach((c: any) => {
      const gap = c()
      console.log(gap.id)
      this.context.gaps.set(gap.id, gap.tag)
    })
    elements.routes.forEach((p: any) => {
      this.context.route = p
    })
  }
}

export default Client