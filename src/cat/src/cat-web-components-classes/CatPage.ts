import CatContext from '@cat/cat-classes/CatContext'
import CatData from '@cat/cat-classes/CatData'

class CatPage extends HTMLElement {
  context: CatContext
  data: CatData
  static get observedAttributes () {
    return ['cat-route'];
  }
  constructor() {
    super();
    this.context = CatContext.instance
    this.data = CatData.instance
    console.log('INNER HTML::::::', this.context)
  }

  connectedCallback() {
    const linkHandler = (e: Event) => {
      const { target } = e
      if (target){
        const link = (e.target as HTMLAnchorElement)
        const origin = link.closest(`a`)
        const target = link.getAttribute('target')
        
        if (origin && target === null) {
          e.preventDefault()
          this.setAttribute('cat-route', link.getAttribute('href') as string)
        }
      }
    }
    window.addEventListener('popstate', this.popstateHandler.bind(this), false)

    document.addEventListener(`click`, linkHandler)
  }

  disconnectedCallback() {
    // console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    // console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log(`Attribute ${name} with ${oldValue} has changed to ${newValue}.`)
    // console.log(`TEMPLATE ${this.context.getRouteNameByRoute(newValue)?.template}`)
    this.changePage(name, newValue)
  }


  changePage(name: string, newValue: any) {
    if(name==='cat-route') {
      const routeTemplate = newValue.replace('/', '').trim()
      let route = 'index'
      if (routeTemplate !== ''){
        console.log('TEMPLATE::::::', routeTemplate)
        route = routeTemplate
      }
      this.innerHTML = this.context.getRouteNameByRoute(route)?.template as string
      history.pushState({}, '', newValue)
    }
  }

  popstateHandler(e: any) {
    const url= new URL(e.currentTarget.location.href)
    this.changePage('cat-route', url.pathname)
  }
}

export default CatPage