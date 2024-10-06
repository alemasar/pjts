import CatApp from "@cat/index"

class Gap extends HTMLElement {
  cat: CatApp
  gaps: Map<string, string>
  scripts: Map<string, string>
  constructor() {
    super();
    this.cat = CatApp.instance;
    this.gaps = new Map<string, string>();
    this.scripts = new Map<string, string>();
  }
  connectedCallback() {
    console.log('CAT',this.cat.context.cat.route)
    this.changeGapRoute(this.cat.context.cat.route)
    this.cat.client.catHooks.addHook('cat-change-gap', (route: string) => {
      console.log('cat-change-gap', route)
      this.changeGapRoute(route)
    })
  }
  addGapCodeToWebComponent(temporalTemplate: HTMLTemplateElement, script: Map<string, string>|undefined) {
    const gapsTetmplates = temporalTemplate.content.querySelectorAll('template')
    this.innerHTML = ''
    gapsTetmplates.forEach((tt) => {
      const scriptTag = document.createElement("script")
      const idTemplate = tt.getAttribute('id') as string
      if (script !== undefined) { 
        const temporalScript = script as Map<string, string>
        console.log(temporalScript.has(idTemplate))
        if (temporalScript.has(idTemplate) === true) {
          const code = temporalScript.get(idTemplate)?.replace('<script>', '').replace('</script>', '')
          scriptTag.append(code as string)
          tt.content.appendChild(scriptTag)
        }
      }
      this.appendChild(tt.content.cloneNode(true))
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")
    const script = this.scripts.get(route) as Map<string, string>|undefined

    console.log('GAPS IN CHANGE GAP ROUTE', script)
    if (this.gaps.has(route) === true) {
      temporalTemplate.innerHTML = this.gaps.get(route) as string
    } else {
      temporalTemplate.innerHTML = this.gaps.get('default') as string
    }
    this.addGapCodeToWebComponent(temporalTemplate, script)
  }
}
export default Gap;
