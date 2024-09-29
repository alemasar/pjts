import type CatContext from '@cat/cat-classes/CatContext'
import type CatHooks from '@cat/cat-classes/CatHooks'
import elements from 'virtual:components'


const defineComponents = () => {
  elements.components.forEach((c: any) => {
    const component = c()
    console.log('COMPONENT BEFORE', customElements.get(component.tag))
    customElements.define(component.tag, component.classCode)
    console.log('COMPONENT AFTER', component.classCode)
  })
}


class Client {
  context: CatContext
  catHooks: CatHooks
  constructor(context: CatContext, catHooks: CatHooks) {
    this.context = context
    this.catHooks = catHooks

    console.log(elements.components)
    elements.components.forEach((c: any) => {
      const component = c()
      this.context.components.set(component.id, component.tag)
    })
    elements.routes.forEach((p: any) => {
      this.context.route = p
    })
  }
}
defineComponents()
export default Client