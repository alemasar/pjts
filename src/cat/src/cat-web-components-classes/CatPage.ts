import CatContext from "@cat/cat-classes/CatContext"
import CatData from "@cat/cat-classes/CatData"
import elements from 'virtual:components'
import CatApp from "@cat/index"

const templates = new Map<string, any>()

class CatPage extends HTMLElement {
  context: CatContext
  data: CatData
  /* static get observedAttributes () {
    return ['cat-route'];
  } */
  constructor() {
    super();
    this.context = CatContext.instance
    this.data = CatData.instance
    // instanceHooks.callHookName('cat-change-route', this.context.cat.route)
    /* this.changePage('cat-route', this.context.cat.route)
    const linkHandler = (e: Event) => {
      const { target } = e
      if (target){
        const link = (e.target as HTMLAnchorElement)
        const origin = link.closest(`a`)
        const target = link.getAttribute('target')
        
        if (origin && target === null) {
          e.preventDefault()
          const route = link.getAttribute('href') as string

          this.setAttribute('cat-route', route)
          console.log('CATAPP IN CAT PAGE',catApp)
          // catApp.client.cat.callHookName('cat-change-gap', route)
          this.changePage('cat-route', route)
        }
      } 
    }
    window.addEventListener('popstate', this.popstateHandler.bind(this), false)

    document.addEventListener(`click`, linkHandler) */
  }

  connectedCallback() {
    const path = CatApp.instance.context.cat.route;
    elements.routes.forEach((er: any) => {
      console.log(er)
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


  changePage(newValue: any) {
      const routeTemplate = newValue.replace('/', '')
      const temporalTemplate = document.createElement("template")
      let route = 'index'
      
      if (routeTemplate !== ''){
        route = routeTemplate
      }
      console.log('CHANGE PAGE', templates.get(route))
      temporalTemplate.innerHTML = templates.get(route)
      this.appendChild(temporalTemplate.content.cloneNode(true))
      history.pushState({}, '', newValue)
  }

  popstateHandler(e: any) {
    const url= new URL(e.currentTarget.location.href)
    this.changePage(url.pathname)
  }
}

export default CatPage