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
var _a, _CatContext_instance;
import { v4 as uuidv4 } from 'uuid';
class CatContext {
    constructor() {
        Object.defineProperty(this, "_internalId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_getTagById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_getComponentIdById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_getRouteTemplateById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_getRouteIdById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_cat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._cat = {
            components: new Map(),
            routes: new Map(),
        };
        this._internalId = '';
        this._getTagById = new Map();
        this._getComponentIdById = new Map();
        this._getRouteTemplateById = new Map();
        this._getRouteIdById = new Map();
    }
    static get instance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _CatContext_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _CatContext_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _CatContext_instance);
    }
    get components() {
        /* return (id: string) => {
          return this._cat.components.get(id)
        } */
        return this._cat.components;
    }
    set component(newValue) {
        this._internalId = uuidv4();
        this._cat.components.set(this._internalId, {
            id: newValue.id,
            tag: newValue.tag,
            template: newValue.template,
        });
        this._getTagById.set(newValue.tag, this._internalId);
        this._getComponentIdById.set(newValue.id, this._internalId);
    }
    get getComponentByTag() {
        return (tag) => {
            return this._cat.components.get(this._getTagById.get(tag));
        };
    }
    get getComponentById() {
        return (id) => {
            return this._cat.components.get(this._getComponentIdById.get(id));
        };
    }
    get routes() {
        /* return (id: string) => {
          return this._cat.components.get(id)
        } */
        return this._cat.routes;
    }
    set route(newValue) {
        this._internalId = uuidv4();
        this._cat.routes.set(this._internalId, {
            id: newValue.id,
            route: newValue.route,
            template: newValue.template,
        });
        this._getRouteTemplateById.set(newValue.route, this._internalId);
        this._getRouteIdById.set(this._internalId, newValue.id);
    }
    get getRouteNameByRoute() {
        return (route) => {
            const pathname = route.replace('/', '');
            console.log(this._cat.routes);
            const idTemplate = this._getRouteTemplateById.get(pathname);
            console.log(idTemplate);
            return this._cat.routes.get(idTemplate);
        };
    }
    get getRouteTemplateById() {
        return (id) => {
            return this._cat.routes.get(this._getRouteIdById.get(id));
        };
    }
    mergeObj(master, merge) {
        const masterKeys = Object.keys(master);
        const mergeKeys = Object.keys(merge);
        const obj = { ...master };
        mergeKeys.forEach((mk) => {
            if (masterKeys.includes(mk) === true) {
                if (typeof master[mk] === 'object' && typeof merge[mk] === 'object') {
                    obj[mk] = this.mergeObj(master[mk], merge[mk]);
                }
                else {
                    obj[mk] = { ...master[mk], ...merge[mk] };
                }
            }
            else {
                obj[mk] = merge[mk];
            }
        });
        return obj;
    }
}
_a = CatContext;
_CatContext_instance = { value: void 0 };
export default CatContext;
