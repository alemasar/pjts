class Router {
  path: string;
  constructor() {
    this.path = ''

    window.addEventListener('popstate', this.popstateHandler.bind(this), false)
  }

  popstateHandler() {
    const event = new CustomEvent("url-changed");
    
    // console.log('POPSTATE::::::::', window.location.pathname)
    // this.changePageTemplateFromLocation()
    document.dispatchEvent(event);
    this.pushHistoryState({
      stateValue: {},
      title: '',
      path: this.path
    });
  }
  pushHistoryState(state: any) {
    const {stateValue={}, title='', path=''} = {...state}
    history.pushState(stateValue, title, path);
  }
}

// export type {Router};
export default Router