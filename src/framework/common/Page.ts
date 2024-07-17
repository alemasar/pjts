class Page extends HTMLElement{
  template: string;
  constructor() {
    super()
    const url = new URL(document.location.href)
    const pathname = url.pathname.split('/')
    this.template = 'indexTemplate'
    pathname.shift()
    if (pathname.length > 0){
      if (pathname[0] !== '') {
        this.template = pathname[0] + 'Template'
      }
    }
    console.log("PATHNAME LENGTH", url.pathname.split('/').length)
    console.log("PATHNAME SPLIT", url.pathname.split('/'))

  }
}

export default () => {
  console.log('hola')
}
