import Router from '@framework/common/Router'
interface IPageLinks{
  obj: HTMLAnchorElement
  handler: (evt: any) => void;
}

const pageLinks: IPageLinks[] = []
const templates: any[] = []

class CatPage extends HTMLElement {
  router: Router;
  templateId: string;
  _root: any;
  constructor() {
    super();
    
    this._root = this.attachShadow({ mode: "closed" });
    const templatePages = this.querySelectorAll('template')
    templatePages.forEach((tp) => {
      templates[tp.getAttribute('id') as any] = tp
    })
    this.templateId = ''
    this.innerHTML = ''
    this.router = new Router()

    document.addEventListener('url-changed', this.changePageTemplateFromLocation.bind(this), false)
  }

  connectedCallback() {
    console.log("Custom element added to page.");
    this.changePageTemplateFromLocation()
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
    document.removeEventListener("url-changed", this.changePageTemplateFromLocation.bind(this), false)
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string) {
    console.log(`Attribute ${name} has changed.`);
  }

  getPathFromUrl() {
    const pathname = window.location.pathname.split('/')
    let goToUrl = ''

    pathname.shift()
    if (pathname.length > 0){
      if (pathname[0] !== '') {
        goToUrl = pathname[0]
      }
    }
    return goToUrl
  }
  
  clickHandler(evt: any) {
    return this.linkHandler(evt)
  }

  linkHandler(evt: any) {
    const link = evt.target as HTMLAnchorElement
    const hrefValue = link.getAttribute("href") as string
    const url = hrefValue.split("/").pop() as string

    evt.preventDefault()
    this.changePageWithUrl(url)
  }

  removeLinksClickEvent() {
    pageLinks.forEach((pl) => {
      pl.obj.removeEventListener("click", pl.handler, false)
    })
    pageLinks.splice(0)
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

  changePageTemplateFromLocation() {
    let goToUrl = this.getPathFromUrl()
    const template = (goToUrl === '') ? 'indexTemplate' : goToUrl + 'Template';
    let templatesSelector = templates[template as any]
    const event = new CustomEvent("page-loaded");

    this.router.path = goToUrl
    if (templatesSelector !== null) {
      this.templateId = template
    } else {
      this.templateId = '404Template'
      goToUrl = '404'
      templatesSelector = templates[this.templateId as any]
    }
    console.log(this.templateId)
    console.log(templatesSelector)

    this._root.innerHTML = ''
    this._root.appendChild(templatesSelector?.content.cloneNode(true))
    this.attachEventClickLinks()
    document.dispatchEvent(event)
  }

  changePageWithUrl(url: string) {
    const urlToGo = url.replace('/', '')
    const event = new CustomEvent("page-loaded");

    this.templateId = 'indexTemplate'
    if (url !== '') {
      this.templateId = urlToGo + 'Template'
    }

    this.router.pushHistoryState({
      stateValue: {},
      title: '',
      path: urlToGo,
    })

    this._root.innerHTML = ''
    this._root.appendChild(templates[this.templateId as any].content.cloneNode(true))
    this.attachEventClickLinks()
    document.dispatchEvent(event)
  }
}
export default CatPage
