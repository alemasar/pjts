import Server from '@cat-server/index'
import Client from '@cat-client/index'
import CatContext from '@cat/cat-classes/CatContext'
import CatHooks from '@cat/cat-classes/CatHooks'

class CatApp {
  static #instance: CatApp;
  context: CatContext
  catHooks: CatHooks
  client: Client
  server: Server
  constructor() {
    this.context = CatContext.instance
    this.catHooks = CatHooks.instance
    this.client = new Client(this.context, this.catHooks)
    this.server = new Server(this.context/*, this.catHooks*/)
  }
  public static get instance(): CatApp {
    if (!CatApp.#instance) {
        CatApp.#instance = new CatApp();
    }

    return CatApp.#instance;
  }
}
export default CatApp
