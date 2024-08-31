 import { createHooks, HookCallback } from 'hookable'

class CatHooks {
  static #instance: CatHooks;
  private _hooks
  private _hookNames: Map<string, Function>
  private _unregisterHookName: Map<string, HookCallback>
  
  private constructor() {
    this._hooks = createHooks()
    this._hookNames = new Map<string, Function>()
    this._unregisterHookName = new Map<string, HookCallback>()
  }

  public static get instance(): CatHooks {
      if (!CatHooks.#instance) {
          CatHooks.#instance = new CatHooks();
      }

      return CatHooks.#instance;
  }
  async addHook(hook: string, handler: Function){
    let oldHook = Function
    let returnHandler: Function = ()=>{
      handler()
    }
    if (this._hookNames.has(hook) === true) {
      oldHook = this._hookNames.get(hook) as FunctionConstructor
      returnHandler = () => {
        oldHook()
        handler()
      }
    }
    this._hookNames.set(hook, handler)
    this._unregisterHookName.set(hook, this._hooks.hook(hook, handler))
  }
  async registerCallHook(hook: string) {
    // console.log(this._hooks.callHook(hook))
    this._hooks.callHook(hook)
  }
  unregisterHook(hook: string) {
    console.log(hook)
    console.log(this._unregisterHookName)
    
    if (this._unregisterHookName.has(hook) === true) {
      const unregisterCallback = this._unregisterHookName.get(hook) as HookCallback
      unregisterCallback()
      this._hookNames.delete(hook)
      this._unregisterHookName.delete(hook)
    }
  }
}

export default CatHooks
