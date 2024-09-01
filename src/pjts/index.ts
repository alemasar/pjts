import cat from '@cat/index'
import CatHooks from '@cat/cat-classes/CatHooks'

const instanceHooks = CatHooks.instance

export default async function() {
  console.log('INIT CAT FRAMEWORK')
  instanceHooks.callHookName('cat-before-load', {})
  await cat()
  instanceHooks.callHookName('cat-after-load', {})
}