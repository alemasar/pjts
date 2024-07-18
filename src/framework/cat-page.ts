class CatPage extends HTMLElement {
  templateId: string;
  constructor() {
    super();
    const url = new URL(document.location.href)
    const pathname = url.pathname.split('/')
    const event = new CustomEvent("page-loaded");
    this.templateId = 'indexTemplate'
    
    pathname.shift()
    if (pathname.length > 0){
      if (pathname[0] !== '') {
        this.templateId = pathname[0] + 'Template'
      }
    }
    console.log("PATHNAME LENGTH", document.getElementById(this.templateId))
    console.log("PATHNAME SPLIT", url.pathname.split('/'))
    this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string
    window.addEventListener('popstate', (evt) => {
      console.log('ENTRO')
      event.preventDefault()
      this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string;
      document.dispatchEvent(event);
    })
  }

  connectedCallback() {
    const links = this.querySelectorAll("a")
    const event = new Event("page-loaded");
    links.forEach((l)=> {
      l.addEventListener('click', (event) => {
        const link = event.target as HTMLAnchorElement
        const hrefValue = link.getAttribute("href") as string
        const url = hrefValue.split("/").pop()
        event.preventDefault()
        console.log("Custom element added to page.", link.getAttribute("href"));
        history.pushState({}, 'newUrl', '/' + url);
        if (url === '') {
          this.templateId = 'indexTemplate'
        } else {
          this.templateId = url + 'Template'
        }
        this.innerHTML = document.getElementById(this.templateId)?.innerHTML as string;
      }, false)
    })
    document.dispatchEvent(event);
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


}
customElements.define("cat-page", CatPage);