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
  addGapCodeToComponent(temporalTemplate: HTMLTemplateElement) {
    const gapsTetmplates = temporalTemplate.content.querySelectorAll('template')
    
    this.innerHTML = ''
    gapsTetmplates.forEach((tt) => {
      document.createElement("script")
      this.appendChild(tt.content.cloneNode(true))
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")

    if (this.gaps.has(route) === true) {
      temporalTemplate.innerHTML = this.gaps.get(route) as string
    } else {
      console.log(this.gaps.get('default'))
      temporalTemplate.innerHTML = this.gaps.get('default') as string
    }
    this.addGapCodeToComponent(temporalTemplate)
  }
}
export default Gap;
