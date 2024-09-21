import server from '@cat-server/index'
import client from '@cat-client/index'

const load = async ()=>{
  console.log('ENTOR EN LOAD')
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
  console.log('INDEX FROM CAT')
  await load()
}
