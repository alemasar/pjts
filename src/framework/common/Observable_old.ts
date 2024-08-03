class Observable {
  private _listeners: Array<Function>
  private _value: string

  constructor(value: string) {
    this._listeners = [];
    this._value = value;
  }

  notify() {
    this._listeners.forEach(listener => listener(this._value));
  }

  subscribe(listener: Function) {
    this._listeners.push(listener);
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if (val !== this._value) {
      this._value = val;
      this.notify();
    }
  }
}

export default Observable;
