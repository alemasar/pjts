import CatContext from '@cat/cat-classes/CatContext';
class CatPage extends HTMLElement {
    static get observedAttributes() {
        return ['cat-route'];
    }
    constructor() {
        super();
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.context = CatContext.instance;
        console.log('INNER HTML::::::', this.context);
    }
    connectedCallback() {
        window.addEventListener('popstate', this.popstateHandler.bind(this), false);
        document.addEventListener(`click`, e => {
            const link = e.target;
            const origin = link.closest(`a`);
            const target = link.getAttribute('target');
            if (origin && target === null) {
                e.preventDefault();
                this.setAttribute('cat-route', link.getAttribute('href'));
            }
        });
    }
    disconnectedCallback() {
        // console.log("Custom element removed from page.");
    }
    adoptedCallback() {
        // console.log("Custom element moved to new page.");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} with ${oldValue} has changed to ${newValue}.`);
        // console.log(`TEMPLATE ${this.context.getRouteNameByRoute(newValue)?.template}`)
        this.changePage(name, newValue);
    }
    changePage(name, newValue) {
        if (name === 'cat-route') {
            const routeTemplate = newValue.replace('/', '').trim();
            let route = 'index';
            if (routeTemplate !== '') {
                console.log('TEMPLATE::::::', routeTemplate);
                route = routeTemplate;
            }
            this.innerHTML = this.context.getRouteNameByRoute(route)?.template;
            history.pushState({}, '', newValue);
        }
    }
    popstateHandler(e) {
        const url = new URL(e.currentTarget.location.href);
        this.changePage('cat-route', url.pathname);
    }
}
export default CatPage;
