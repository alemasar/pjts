class Server {
  url: URL
  constructor() {
    this.url = new URL(document.location.href)
    
  }
}

const serverPromise: Promise<Function> = new Promise((resolve, reject) => {
  // This Promise resolves to a string
  try{
    setTimeout(async () => {
      resolve(function() {
        console.log('INDEX FROM CAT SERVER')
      })
    }, 3000)
  } catch(e) {
    reject('ERROR FROM CAT SERVER')
  }
});

export default serverPromise
