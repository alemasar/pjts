/**
 * The Singleton class defines an `instance` getter, that lets clients access
 * the unique singleton instance.
 */
class Singleton {
  static #instance: Singleton;
  private _values: Map<string, any>;
  private _commits: Map<string, any>;
  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this._commits = new Map<string, any>()
    this._values = new Map<string, any>()
  }

  /**
   * The static getter that controls access to the singleton instance.
   *
   * This implementation allows you to extend the Singleton class while
   * keeping just one instance of each subclass around.
   */
  public static get instance(): Singleton {
      if (!Singleton.#instance) {
          Singleton.#instance = new Singleton();
      }

      return Singleton.#instance;
  }
  
  mergeObj(master: any, merge: any) {
    const masterKeys = Object.keys(master)
    const mergeKeys = Object.keys(merge)
    const obj: Record<string, any> = {...master}
    mergeKeys.forEach((mk) => {
      if (masterKeys.includes(mk) === true) {
        if (typeof master[mk] === 'object' && typeof merge[mk] === 'object') {
          obj[mk] = this.mergeObj(master[mk], merge[mk])
        } else {
          obj[mk] = {...master[mk], ...merge[mk]}
        }
      } else {
        obj[mk] = merge[mk]
      }
    })
    return obj
  }

  push(options: {id?: string, obj?: any}) {
    let commits = this._commits
    if (typeof options.id !== 'undefined') {
      commits = this._commits
    }
    // console.log('COMMIT WITH ID', commits)
    for (let entry of commits) { // lo mismo que recipeMap.entries()
      // console.log(entry); // pepino,500 (etc)
      if (this._values.has(entry[0]) === false) {
        this._values.set(entry[0], new Map())
      }
      if (this._values.get(entry[0]).get(entry[1].id) === undefined) {
        this._values.get(entry[0]).set(entry[1].id, entry[1].obj)
      } else if (entry[1].overwrite === false){
        const master = this._values.get(entry[0]).get(entry[1].id)
        // console.log('MASTER', master)
        this._values.get(entry[0]).set(entry[1].id, this.mergeObj(master, entry[1].obj))
      } else {
        this._values.get(entry[0]).set(entry[1].id, entry[1].obj)
      }
    }
    // console.log('QUe SHA GUARDAT', this._values)
  }
  
  get commits() {
    return this._commits
  }

  commit(id: string, newValue: any) {
    if (!this._commits.get(id)) {
      this._commits.set(id, newValue)
    } else {
      this._commits.set(id, this.mergeObj(this._commits, newValue))
    }
    // console.log('SINGLETONS COMMITS:::::::::::',this._commits)
  }
  pull(idPage:string, idComponent:string) {
    //console.log('VALORS',this._values)
        //console.log('ID PAGE',idPage)
            //console.log('ID COMPONENT',idComponent)

    return this._values.get(idPage).get(idComponent)
  }
}

export default Singleton
