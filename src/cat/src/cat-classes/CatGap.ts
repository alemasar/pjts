import CatHooks from "./CatHooks"

const instanceHooks = CatHooks.instance

class Gap extends HTMLElement {
  gaps: Map<string, string>
  constructor() {
    super();
    this.gaps = new Map<string, string>();
  }
  connectedCallback() {
    instanceHooks.addHook('cat-change-gap', (route: string) => {
      console.log('cat-change-gap', route)
      this.changeGapRoute(route)
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")
    const gapRoute = route.replace('\/', '')
    this.innerHTML = ''

    if (route === '') {
      console.log('ROUTE IGUAL A NADA ', route)
      temporalTemplate.innerHTML = this.gaps.get('index') as string  
    } else {
      temporalTemplate.innerHTML = this.gaps.get(gapRoute) as string
    }
    
    temporalTemplate.content.querySelectorAll('template').forEach((t) => {
      this.appendChild(t.content.cloneNode(true))
    })
  }
}
export default Gap;
