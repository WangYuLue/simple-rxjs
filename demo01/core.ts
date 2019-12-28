export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    this._subscribe(observer);
  }
}