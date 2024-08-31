import server from '@cat-server/index'
import client from '@cat-client/index'
import CatHooks from '@cat/cat-classes/CatHooks'

const load = async ()=>{
  try {
    const returnValues = await Promise.all([server, client])
    console.log(returnValues)
    for (const loadFunction of returnValues) {
      loadFunction()
    }
  } catch(e) {
    console.log('ERROR FROM CAT')
  }
}

export default async function() {
  await load()
  console.log('INDEX FROM CAT')
}
