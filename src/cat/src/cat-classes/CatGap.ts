import CatApp from "@cat/index"

class Gap extends HTMLElement {
  cat: CatApp
  gaps: Map<string, string>
  constructor() {
    super();
    this.cat = CatApp.instance;
    this.gaps = new Map<string, string>();
  }
  connectedCallback() {
    console.log('CAT',this.cat.context.cat.route)
    this.changeGapRoute(this.cat.context.cat.route)
    this.cat.client.catHooks.addHook('cat-change-gap', (route: string) => {
      console.log('cat-change-gap', route)
      this.changeGapRoute(route)
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")
    temporalTemplate.innerHTML = this.gaps.get(route) as string
    const gapsTetmplates = temporalTemplate.content.querySelectorAll('template')
    console.log(this.gaps.get(route))
    this.innerHTML = ''
    gapsTetmplates.forEach((tt) => {
      this.appendChild(tt.content.cloneNode(true))
    })
  }
}
export default Gap;
