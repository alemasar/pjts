import Observable from "@framework/common/Observable";

interface IDataBindings {
  [index: string]: Observable[];
}

/**
 * The Singleton class defines an `instance` getter, that lets clients access
 * the unique singleton instance.
 */
class Singleton {
  static #instance: Singleton;
  private _value: IDataBindings;
  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this._value = {} as IDataBindings
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
  set value(value: any) {
      this._value = value;
  }

  get value() {
      return this._value;
  }
  /**
   * Finally, any singleton can define some business logic, which can be
   * executed on its instance.
   */
  public existsElement(index: string) {
    const keysDatabindings = Object.keys(this._value);
    return keysDatabindings.includes(index)
  }
  public modifyElementValue(index: string, value: any) {
    if (this.existsElement(index) === true) {
      this._value[index].forEach((b: any) => {
        console.log('INDDEX::::::', b)
        b.value = value;
      })
    }
  }
  public addElement(index: string, element: Observable ) {
    if (this.existsElement(index) === false) {
      this._value[index]=[]
    }
    this._value[index].push(element)
  }
  public deleteElement(index: string) {
    delete this._value[index]
  }
}

const singleton = Singleton.instance

export default singleton
