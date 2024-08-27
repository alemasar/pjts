const clientPromise: Promise<Function> = new Promise((resolve, reject) => {
  // This Promise resolves to a string
  try{
    setTimeout(async () => {
      resolve(function() {
        console.log('INDEX FROM CAT CLIENT')
      })
    }, 1000)
  } catch(e) {
    reject('ERROR FROM CAT CLIENT')
  }
});



export default clientPromise