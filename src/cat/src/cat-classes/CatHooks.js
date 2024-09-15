var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _CatHooks_instance;
import { createHooks } from 'hookable';
class CatHooks {
    constructor() {
        Object.defineProperty(this, "_hooks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_hookNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_unregisterHookName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._hooks = createHooks();
        this._hookNames = new Map();
        this._unregisterHookName = new Map();
    }
    static get instance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _CatHooks_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _CatHooks_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _CatHooks_instance);
    }
    async addHook(hook, handler) {
        this._hookNames.set(hook, handler);
        this._hooks.hook(hook, handler);
    }
    callHookName(hook, args) {
        if (this._hookNames.has(hook) === true) {
            this._unregisterHookName.set(hook, () => {
                this._hooks.callHook(hook, args);
            });
            const unregisterHookName = this._unregisterHookName.get(hook);
            unregisterHookName();
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
    unregisterHook(hook) {
        console.log(hook);
        console.log(this._unregisterHookName);
        if (this._unregisterHookName.has(hook) === true) {
            const unregisterCallback = this._unregisterHookName.get(hook);
            unregisterCallback();
        }
        this._hookNames.delete(hook);
        this._unregisterHookName.delete(hook);
    }
}
_a = CatHooks;
_CatHooks_instance = { value: void 0 };
export default CatHooks;
