class Server {
  url: URL
  route: string
  constructor() {
    this.url = new URL(document.location.href)
    let path = this.url.pathname.replace('/','')
    if (path === '') {
      path = 'index'
    }
    this.route = path
  }
}

export default Server
