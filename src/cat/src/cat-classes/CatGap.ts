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
    this.changeGapRoute(this.cat.context.cat.route)
    console.log('Custom gap added to page.')
    this.cat.client.catHooks.addHook('cat-change-page', (route: string) => {
      console.log('cat-change-page', route)
      // this.changeGapRoute(route)
    })
  }
  disconnectedCallback() {
    const scriptTag = this.querySelectorAll('script')
    this.cat.client.catHooks.unregisterHook('cat-change-page')
    scriptTag.forEach((st) => {
      st.parentElement?.removeChild(st)
    })
    this.innerHTML = ''
    console.log("Custom element removed from page.", scriptTag);
  }
  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }
  addGapCodeToWebComponent(temporalTemplate: HTMLTemplateElement, gapScripts: Map<string, string>|undefined) {
    const gapsTemplates = temporalTemplate.content.querySelectorAll('template')
    console.log('GAP SCRIPTS::::',gapScripts)
    if (gapScripts?.has('default') === true) {
      const scriptTag = document.createElement("script")
      scriptTag.type = "module"
      const code = gapScripts.get('default')?.replace('<script>', '').replace('</script>', '')
      scriptTag.append(code as string)
      temporalTemplate.content.appendChild(scriptTag)
      this.appendChild(temporalTemplate.content.cloneNode(true))
    }
    
    gapsTemplates.forEach((tt) => {
      const scriptTag = document.createElement("script")
      scriptTag.type = "module"
      const idTemplate = tt.getAttribute('id') as string
      if (gapScripts !== undefined) { 
        const temporalScript = gapScripts as Map<string, string>
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

    if (this.gaps.has(route) === true) {
      temporalTemplate.innerHTML = this.gaps.get(route) as string
    } else {
      temporalTemplate.innerHTML = this.gaps.get('default') as string
    }
    this.addGapCodeToWebComponent(temporalTemplate, script)
  }
}
export default Gap;
