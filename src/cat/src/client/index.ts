import type CatContext from '@cat/cat-classes/CatContext'
import type CatHooks from '@cat/cat-classes/CatHooks'
import elements from 'virtual:components'

class Client {
  context: CatContext
  catHooks: CatHooks
  constructor(context: CatContext, catHooks: CatHooks) {
    this.context = context
    this.catHooks = catHooks

    elements.components.forEach((c: any) => {
      const component = c()
      this.context.components.set(component.id, component.tag)
    })
    elements.routes.forEach((p: any) => {
      this.context.route = p
    })
  }
}

export default Client