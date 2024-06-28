import Observable from "@framework/common/Observable"
class Computed extends Observable {
  constructor(value: any, deps: any) {
    super(value());
    const listener = () => {
      this._value = value();
      this.notify();
    }
    deps.forEach(dep => dep.subscribe(listener));
  }

  get value() {
    return this._value;
  }

  set value(_) {
    throw "Cannot set computed property";
  }
}

export default Computed;