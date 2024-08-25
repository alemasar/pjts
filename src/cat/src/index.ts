import server from '@cat-server/index'
import client from '@cat-client/index'

server()
client()

export default function() {
  console.log('INDEX FROM CAT')
}
