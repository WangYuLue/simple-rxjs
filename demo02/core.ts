export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    this._subscribe(observer);
  }
}

export function of(...args) {
  return new Observable(observer => {
    args.forEach(arg => {
      observer.next(arg);
    })
    observer.complete();
  })
}

