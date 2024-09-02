import CatContext from '@cat/cat-classes/CatContext'

class CatPage extends HTMLElement {
  context: CatContext
  static get observedAttributes () {
    return ['cat-route'];
  }
  constructor() {
    super();
    this.context = CatContext.instance
    console.log('INNER HTML::::::', this.context)
  }

  connectedCallback() {
    document.addEventListener(`click`, e => {
      const link = e.target as HTMLElement
      const origin = link.closest(`a`)
      const target = link.getAttribute('target')
      
      if (origin && target === null) {
        e.preventDefault()
        this.setAttribute('cat-route', 'index')
      }
    })
  }

  disconnectedCallback() {
    // console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    // console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log(`Attribute ${name} with ${oldValue} has changed to ${newValue}.`)
    console.log(`TEMPLATE ${this.context.getRouteNameByRoute(newValue)?.template}`)
    if(oldValue !== null) {
      this.innerHTML = this.context.getRouteNameByRoute(newValue)?.template as string
    }
  }
}

export default CatPage