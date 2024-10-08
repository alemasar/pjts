import CatApp from "@cat/index"
import elements from 'virtual:gaps'

const templates = new Map<string, any>()

class CatPage extends HTMLElement {
  cat: CatApp
  constructor() {
    super();
    this.cat = CatApp.instance
    const definitionGaps = elements.gaps

    definitionGaps.forEach((dg: any) => {
      const definitionGap = dg()
      customElements.define(definitionGap.tag, definitionGap.classCode)
    })
    const linkHandler = (e: Event) => {
      const { target } = e
      if (target){
        const link = (e.target as HTMLAnchorElement)
        const origin = link.closest(`a`)
        const target = link.getAttribute('target')
        
        if (origin && target === null) {
          e.preventDefault()
          const path = link.getAttribute('href') as string
          const route = this.getRouteTemplate(path)
          this.cat.context.cat.route = route
          this.changePage(route)
          // this.cat.client.catHooks.callHookName('cat-change-page', route)
        }
      }
    }
    window.addEventListener('popstate', this.popstateHandler.bind(this), false)
    document.addEventListener(`click`, linkHandler)
  }

  connectedCallback() {
    const path = this.cat.context.cat.route;
    elements.routes.forEach((er: any) => {
      templates.set(er.route, er.template)
    })
    this.changePage(path)
  }

  disconnectedCallback() {
    // console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    // console.log("Custom element moved to new page.");
  }

  /* attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log(`Attribute ${name} with ${oldValue} has changed to ${newValue}.`)
    // console.log(`TEMPLATE ${this.context.getRouteNameByRoute(newValue)?.template}`)
    this.changePage(name, newValue)
  } */

  changePage(route: any) {
      const temporalTemplate = document.createElement("template")
      this.innerHTML = '';
      temporalTemplate.innerHTML = templates.get(route)
      this.appendChild(temporalTemplate.content.cloneNode(true))
      history.pushState({}, '', route)
  }
  
  getRouteTemplate(path: string) {
    const routeTemplate = path.replace('/', '')
    let route = 'index'
    
    if (routeTemplate !== ''){
      route = routeTemplate
    }
    return route
  }

  popstateHandler(e: any) {
    const pathName = new URL(e.currentTarget.location.href).pathname
    const route = this.getRouteTemplate(pathName)

    this.changePage(route)
  }
}

export default CatPage