import CatApp from "@cat/index"
import { v4 as uuidv4 } from 'uuid';

class Gap extends HTMLElement {
  cat: CatApp
  gaps: Map<string, string>
  scripts: Map<string, string>
  id: string
  handlerGapLoadedEvent: EventListener
  constructor() {
    super();
    this.cat = CatApp.instance;
    this.gaps = new Map<string, string>();
    this.scripts = new Map<string, string>();
    this.id = uuidv4()
    
    this.handlerGapLoadedEvent = ((event: CustomEvent) => {
      console.log('GAP LOADED', event.detail)
      console.log('ID:::::', this.id)
    }) as EventListener
  }
  connectedCallback() {
    this.changeGapRoute(this.cat.server.route)
    console.log('Custom gap added to page.')
    document.addEventListener('cat-gap-loaded', this.handlerGapLoadedEvent , false)
  }
  disconnectedCallback() {
    const scriptTag = this.querySelectorAll('script')
    // this.cat.client.catHooks.unregisterHook('cat-change-page')
    scriptTag.forEach((st) => {
      st.parentElement?.removeChild(st)
      document.removeEventListener('cat-gap-loaded', this.handlerGapLoadedEvent)
    })
    this.innerHTML = ''
    console.log("Custom element removed from page.", scriptTag);
  }
  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  addDefaultScript(temporalTemplate: HTMLTemplateElement, gapScripts: Map<string, string>|undefined) {
      const scriptTag = document.createElement("script")
      scriptTag.type = "module"
      const code = gapScripts?.get('default')
      scriptTag.append(code as string)
      temporalTemplate.content.appendChild(scriptTag)
      this.appendChild(temporalTemplate.content.cloneNode(true))
  }

  addGapCodeToWebComponent(temporalTemplate: HTMLTemplateElement, gapScripts: Map<string, string>|undefined) {
    const gapsTemplates = temporalTemplate.content.querySelectorAll('template')
    console.log('GAP SCRIPTS::::',gapScripts)
    if (gapScripts?.has('default') === true) {
      this.addDefaultScript(temporalTemplate, gapScripts)
    }
    
    gapsTemplates.forEach((tt) => {
      if (gapScripts !== undefined) { 
        const scriptTag = document.createElement("script")
        scriptTag.type = "module"
        const idTemplate = tt.getAttribute('id') as string
        const temporalScript = gapScripts as Map<string, string>
        if (temporalScript.has(idTemplate) === true) {
          const code = temporalScript.get(idTemplate)
          console.log('CODE', code)
          scriptTag.append(code as string)
          tt.content.appendChild(scriptTag)
        }
      }
      this.appendChild(tt.content.cloneNode(true))
    })
  }
  changeGapRoute(route: string) {
    const temporalTemplate = document.createElement("template")
    let script = this.scripts.get(route) as Map<string, string>|undefined

    if (this.scripts.has('default') === true) {
      this.addGapCodeToWebComponent(temporalTemplate, script)
    }
    console.log(this.gaps)
    if (this.gaps.has(route) === true) {
      temporalTemplate.innerHTML = this.gaps.get(route) as string
    } else {
      temporalTemplate.innerHTML = this.gaps.get('default') as string
    }
    this.addGapCodeToWebComponent(temporalTemplate, script)
  }
}
export default Gap;
