import Server from '@cat-server/index'
import Client from '@cat-client/index'
import CatContext from '@cat/cat-classes/CatContext'
import CatHooks from '@cat/cat-classes/CatHooks'

class CatApp {
  static #instance: CatApp;
  client: Client
  server: Server
  private constructor() {
    const context = CatContext.instance
    const catHooks = CatHooks.instance
    console.log('CLIENT::::::')
    this.client = new Client(context, catHooks)
    this.server = new Server()
  }
  public static get instance(): CatApp {
    if (!CatApp.#instance) {
        CatApp.#instance = new CatApp();
    }

    return CatApp.#instance;
  }
}
export default CatApp
