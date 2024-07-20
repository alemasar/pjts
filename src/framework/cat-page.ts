const pageLinks: { obj: HTMLAnchorElement; handler: (evt: any) => void; }[] = []

class CatPage extends HTMLElement {
  templateId: string;
  constructor() {
    super();
    const event = new CustomEvent("page-loaded");

    this.templateId = ''
    this.popstateHandler()
    window.addEventListener('popstate', this.popstateHandler.bind(this), false)
    document.dispatchEvent(event);
  }

  connectedCallback() {

  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
    window.removeEventListener("popstate", this.popstateHandler.bind(this), false)
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string) {
    console.log(`Attribute ${name} has changed.`);
  }
  
  popstateHandler() {
    // const event = new CustomEvent("page-loaded");
    console.log('POPSTATE::::::::', window.location.pathname)
    history.pushState({}, '', '');
    this.changePageTemplateFromLocation()
    // document.dispatchEvent(event);
  }

  attachEventClickLinks() {
    const links = this.querySelectorAll("a")
    this.removeLinksClickEvent()
    links.forEach((l)=> {
      const returnObj = {
        obj: l,
        handler: this.clickHandler.bind(this),
      }
      l.addEventListener('click', this.clickHandler.bind(this) , false);
      pageLinks.push(returnObj);
    })
  }

  removeLinksClickEvent() {
    pageLinks.forEach((pl) => {
      console.log("REMOVE EVENT")
      pl.obj.removeEventListener("click", pl.handler, false)
    })
    pageLinks.splice(0)
  }

  changePageTemplateFromLocation() {
    let goToUrl = this.getPathFromUrl()
    const templatesSelectors = document.body.querySelectorAll("template")
    const templates = Array.from(templatesSelectors)
    const templateIds = templates.map((t) => t.id)
    const template = (goToUrl === '') ? 'indexTemplate' : goToUrl + 'Template';
    console.log("TEMPLATES IDS::::::::", template)
    console.log("PUSH STATE::::::::", history)
    if (templateIds.includes(template) === true) {
      this.templateId = template
    } else if (templateIds.includes(goToUrl + 'Template') === false) {
      console.log('GO TO URL BEFORE 404', goToUrl)
      this.templateId = '404Template'
      goToUrl = '404'
    }
    this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string
    this.attachEventClickLinks()
  }
  
  clickHandler(evt: any) {
    console.log("ENTRO EN HANDLER CLICK", this.linkHandler)
    return this.linkHandler(evt)
  }

  linkHandler(evt: any) {
    // const event = new Event("page-loaded");
    const link = evt.target as HTMLAnchorElement
    const hrefValue = link.getAttribute("href") as string
    const url = hrefValue.split("/").pop() as string
    evt.preventDefault()
    console.log("LINK HANDLER", url);
    this.changePageWithUrl(url)
    // document.dispatchEvent(event);
  }

  getPathFromUrl() {
    // const url = new URL(document.location.href)
    const pathname = window.location.pathname.split('/')
    let goToUrl = ''
    console.log('LOCATION HREF::::::', pathname)
    pathname.shift()
    if (pathname.length > 0){
      if (pathname[0] !== '') {
        goToUrl = pathname[0]
      }
    }
    return goToUrl
  }

  changePageWithUrl(url: string) {
    const urlToGo = url.replace('/', '')
    this.templateId = 'indexTemplate'

    if (url !== '') {
      this.templateId = urlToGo + 'Template'
    }
    history.pushState({}, '', urlToGo);
    console.log("URL TO GO changePageWithUrl:::::::", history.state)
    this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string
    this.attachEventClickLinks()
  }
}
export default CatPage