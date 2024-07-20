interface IPageLinks{
  obj: HTMLAnchorElement
  handler: (evt: any) => void;
}

const pageLinks: IPageLinks[] = []

class Router {
  path: string;
  constructor() {
        const event = new CustomEvent("page-loaded");

    this.path = ''
    window.addEventListener('popstate', (evt) => {
      const event = new CustomEvent("page-loaded");

      evt.preventDefault()
      
      console.log('POPSTATE::::::::', evt)
      document.dispatchEvent(event);
    })
    document.dispatchEvent(event);
  }
}

