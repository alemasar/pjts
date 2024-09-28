import CatHooks from "./CatHooks"

const instanceHooks = CatHooks.instance

class Gap extends HTMLElement {
  gaps: Map<string, string>
  constructor() {
    super();
    this.gaps = new Map<string, string>();
    instanceHooks.addHook('cat-change-route', (route: string) => {
      this.changeGapRoute(route.replace('\/', ''))
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")
    this.innerHTML = ''
    if (route === '') {
      temporalTemplate.innerHTML = this.gaps.get('default') as string  
    } else {
      temporalTemplate.innerHTML = this.gaps.get(route) as string
    }
    temporalTemplate.content.querySelectorAll('template').forEach((t) => {
      this.appendChild(t.content.cloneNode(true))
    })
  }
}
export default Gap;
