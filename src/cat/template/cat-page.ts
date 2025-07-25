import { CatRouter } from "@cat/core/cat-router";

export class CatPage extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    //this.loadTemplate();
    this.loadPageFromRouter();
    this.shadow.addEventListener('click', this.linkHandler.bind(this))
    window.addEventListener('popstate', this.loadPageFromRouter.bind(this), false)
  }

  private linkHandler (e: Event) {
    const target = e.composedPath()
    const checkLink = target[0] as HTMLAnchorElement
    if (checkLink.tagName.toUpperCase() === 'A'){
      e.preventDefault()
      const pathname = checkLink.href
      history.pushState({}, '', pathname)
      this.loadPageFromRouter()
    }
  }

  private loadPageFromRouter() {
    const router = CatRouter.getInstance();
    console.log('Router:', );
    // Get pathname from current URL
    let pathname = window.location.pathname;
    /* if (pathname === '/') {
      pathname = 'index';
    } */

    // Get the route ID from the routes map using pathname
    const routeId = router.getRouteTemplateName(pathname);

    console.log('Route ID found:', routeId);
    if (routeId) {
      // Get the template from templates map using the route ID
      const template = router.getTemplate(routeId);
      const parameters = router.getParameters(routeId);
      console.log('Parameters:', parameters); 
      // console.log('Template found:', template);
      if (template) {
        this.render(template);
      } else {
        this.renderError('Template not found for route ID: ' + routeId);
      }
    } else {
      this.renderError('Route not found for pathname: ' + pathname);
    }
  }

  private renderError(message: string) {
    const temporalTemplate = document.createElement("template")
    temporalTemplate.innerHTML = `
      <div class="w-screen h-screen min-w-screen min-h-screen m-0 p-0 box-border flex items-center justify-center">
        <div class="text-center border-2 border-dashed border-red-400 rounded-lg bg-red-50 text-red-600 p-8">
          <h3 class="text-lg font-bold mb-2">Page Error</h3>
          <p>${message}</p>
        </div>
      </div>
    `;
    this.shadow.appendChild(temporalTemplate.content.cloneNode(true))
  }
 
  private render(template: string) {
    const temporalTemplate = document.createElement("template")
    temporalTemplate.innerHTML = `
    <style>
    :host {
  height: 100%;
  width: 100%;
  display:block;
  box-sizing: border-box;
  background-color: lightskyblue;
  font-size: 20px;
}

    </style>
      ${template}
    `;
    this.shadow.innerHTML = ''
    this.shadow.appendChild(temporalTemplate.content.cloneNode(true))
  }

}

// Register the custom element
// customElements.define('cat-page', CatPage);

// Export for use in other modules
export default CatPage;
