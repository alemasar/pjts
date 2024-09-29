import type CatContext from '@cat/cat-classes/CatContext'
//import type CatHooks from '@cat/cat-classes/CatHooks'

/* interface IPageRoute{
  id: string
  template: string
  route: string
} */

class Server {
  url: URL
  constructor(context: CatContext/*, catHooks: CatHooks*/) {
    console.log('CONSTRUCTOR SERVER')
    // const catPages = document.querySelectorAll('cat-page[cat-route]')
    
    this.url = new URL(document.location.href)
    let path = this.url.pathname.replace('/','')
    if (path === '') {
      path = 'index'
    }
    context.cat.route = path
    console.log('CONTEXT', context.cat.route)
    /* catPages.forEach(cp => {
      cp.setAttribute("cat-route", path)
    }) */
    // console.log(this.url.pathname.replace('/',''))
    // console.log(context.getRouteNameByRoute(this.url.pathname) as IPageRoute)
  }
}

/* const serverPromise: Promise<Function> = new Promise((resolve, reject) => {
  // This Promise resolves to a string
  try{
    setTimeout(async () => {
      resolve(function() {
        const serverClass = new Server()
        console.log('INDEX FROM CAT SERVER', serverClass)
      })
    }, 500)
  } catch(e) {
    reject('ERROR FROM CAT SERVER')
  }
}); */

export default Server
