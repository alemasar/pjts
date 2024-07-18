const pageLinks: { obj: HTMLAnchorElement; handler: (evt: any) => void; }[] = []
class CatPage extends HTMLElement {
  templateId: string;
  constructor() {
    super();
      const event = new CustomEvent("page-loaded");
    this.templateId = ''
    this.changePageTemplateFromLocation()
    window.addEventListener('popstate', (evt) => {
      const event = new CustomEvent("page-loaded");
      console.log('ENTRO')
      evt.preventDefault()
      this.changePageTemplateFromLocation()
      document.dispatchEvent(event);
    })
    document.dispatchEvent(event);
  }

  connectedCallback() {

  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`Attribute ${name} has changed.`);
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
    console.log("LINK HANDLER", link.getAttribute("href"));
    this.changePageWithUrl(url)
    // document.dispatchEvent(event);
  }

  getPathFromUrl() {
    console.log('LOCATION HREF::::::',document.location.href)
    const url = new URL(document.location.href)
    const pathname = url.pathname.split('/')
    let goToUrl = ''
   console.log(url)
    pathname.shift()
    if (pathname.length > 0){
      if (pathname[0] !== '') {
        goToUrl = pathname[0]
      }
    }
    return goToUrl
  }

  changePageTemplateFromLocation() {
    const goToUrl = this.getPathFromUrl()
    this.templateId = 'indexTemplate'

    console.log("URL TO GO changePageTemplateFromLocation::::::::", history.state)
    if (goToUrl !== '') {
      this.templateId = goToUrl + 'Template'
    }
    history.pushState({}, '', '/' + goToUrl);
    this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string
    this.attachEventClickLinks()
  }
  changePageWithUrl(url: string) {
    const urlToGo = url.replace('/', '')
    this.templateId = 'indexTemplate'

    if (url !== '') {
      this.templateId = urlToGo + 'Template'
    }
    history.pushState({}, '', '/' + urlToGo);
    console.log("URL TO GO changePageWithUrl:::::::", history.state)
    this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string
    this.attachEventClickLinks()
  }
}
export default CatPage