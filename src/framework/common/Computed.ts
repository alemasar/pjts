import Observable from "@framework/common/Observable"
class Computed extends Observable {
  constructor(value: any, deps: any) {
    super(value());
    const listener = () => {
      this.value = value();
      this.notify();
    }
    deps.forEach((dep: any) => dep.subscribe(listener));
  }

  get value(): any {
    return this.value;
  }

  set value(_) {
    throw "Cannot set computed property";
  }
}

export default Computed;