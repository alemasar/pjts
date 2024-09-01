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
    this._hookNames.set(hook, handler)
    this._hooks.hook(hook, handler)
  }
  callHookName(hook: string, args: any) {
    if (this._hookNames.has(hook) === true) {
      this._unregisterHookName.set(hook, () => {
        this._hooks.callHook(hook, args)
      })
      const unregisterHookName = this._unregisterHookName.get(hook) as HookCallback
      unregisterHookName()
    }
  }

//     this._hooks.callHook(hook)
  /* async registerCallHook(hook: string) {
    let allHooks = new Array<Function>()
    
    if (this._unregisterHookName.has(hook) === false) {
      this._unregisterHookName.set(hook,new Array())
    }
    allHooks = this._unregisterHookName.get(hook) as Array<HookCallback>
    this._hooks.callHook(hook)
    const hola = this._hooks.callHook(hook)
    allHooks.push(hola as HookCallback)
    
  } */
  unregisterHook(hook: string) {
    console.log(hook)
    console.log(this._unregisterHookName)
    
    if (this._unregisterHookName.has(hook) === true) {
      const unregisterCallback = this._unregisterHookName.get(hook) as HookCallback
      unregisterCallback()
    }
    this._hookNames.delete(hook)
    this._unregisterHookName.delete(hook)
  }
}

export default CatHooks
