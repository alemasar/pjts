import CatContext from '@cat/cat-classes/CatContext'
// import CatHooks from '@cat/cat-classes/CatHooks'

const clientPromise: Promise<Function> = new Promise((resolve, reject) => {
  // This Promise resolves to a string
  try{
    setTimeout(async () => {
      resolve(function() {
        const tagName=CatContext.instance.getComponentByTag('another-component-tag')

        console.log('INDEX FROM CAT CLIENT ID INTERN FROM TAG', tagName)
                // console.log('INDEX FROM CAT CLIENT ID INTERN FROM ID COMPONENT', CatContext.instance.getComponentById(tagName))
      })
    }, 1000)
  } catch(e) {
    reject('ERROR FROM CAT CLIENT')
  }
});



export default clientPromise