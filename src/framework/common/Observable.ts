/* maps observable properties to a Set of
observer functions, which use the property */
const observers = new Map()

/* contains the triggered observer functions,
which should run soon */
const queuedObservers = new Set()

/* points to the currently running 
observer function, can be undefined */
// let currentObserver: any

/* const get = (target: any, key: string, receiver: any) => {
  console.log('KEY FUERA PROXY', key)
  return Reflect.get(target[key], key, receiver)
} */
const createProxy = (obj: any) => {
  const get = (target: any, key: string) => {
    console.log(target)
    const objKeys = Object.keys(obj)
    console.log(key)
    console.log(obj[key])
    if (objKeys.includes(key)) {
      return new Proxy(obj[key], {get})
    }
    return obj
  }
  const proxy = new Proxy(obj, {get})
  return proxy
}
class Observable  {
  /* transforms an object into an observable 
  by wrapping it into a proxy, it also adds a blank
  Map for property-observer pairs to be saved later */
  observable (objId: string, obj: any) {
    /* const getHandler = (target: any, key: string, receiver: any) => {
      return this.getHandler(target, key, receiver, objId)
    }
    const proxy = new Proxy(obj, {get}) */
    if (!observers.get(objId)) {
      observers.set(objId, new Set())
    }
    // return new Proxy(obj, {get: getHandler.bind(this), set: this.setHandler.bind(this)})
    return createProxy(obj)
  }
  deleteObserver(key: any) {
    observers.delete(key)
  }
  /* this trap intercepts get operations,
  it does nothing if no observer is executing
  at the moment */
  /* private getHandler (target: any, key: string, receiver: any, id: string) {
    console.log('KEY IN GETHANDLER:::::::::', key)
    const result = Reflect.get(target, key, receiver)
    if (key === "id") {
      return id
    }
    if (currentObserver) {
      this.registerObserver(target, id, currentObserver)
      if (typeof result === 'object') {
        // Reflect.set(target, key, observableResult, receiver)
        return Reflect.get(target[key], key, receiver)
      }
    }
    return result
  } */

  /* if an observer function is running currently,
  this function pairs the observer function 
  with the currently fetched observable property
  and saves them into the observers Map */
  /* private registerObserver (target: any, id: string, observer: any) {
    let observersForKey = observers.get(id)
    if (!observersForKey) {
      observersForKey = new Set()
      observers.get(id).set(id, observersForKey)
    }
    observersForKey.add(observer)
  } */

  /* this trap intercepts set operations,
  it queues every observer associated with the
  currently set property to be executed later */
  /* private setHandler (target: any, p: string | symbol, newValue: any, receiver: any): boolean {
    const observersForKey = observers.get(target).get(p)
    if (observersForKey) {
      observersForKey.forEach(this.queueObserver.bind(this))
    }
    return Reflect.set(target, p, newValue, receiver)
  } */

  /* the exposed observe function */
  observe (fn: any) {
    this.queueObserver(fn)
  }

  /* adds the observer to the queue and 
  ensures that the queue will be executed soon */
  private queueObserver (observer: any) {
    if (queuedObservers.size === 0) {
      Promise.resolve().then(this.runObservers.bind(this))
    }
    queuedObservers.add(observer)
  }

  /* runs the queued observers,
  currentObserver is set to undefined in the end */
  private runObservers () {
    try {
      queuedObservers.forEach(this.runObserver)
    } finally {
      // currentObserver = undefined
      queuedObservers.clear()
    }
  }

  /* sets the global currentObserver to observer, 
  then executes it */
  private runObserver (observer: any) {
    // currentObserver = observer
    observer()
  }
}

export default new Observable()
