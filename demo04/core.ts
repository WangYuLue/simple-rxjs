export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    const defaultObserver = {
      next: () => { },
      error: () => { },
      complete: () => { }
    }
    if (typeof observer === 'function') {
      return this._subscribe({ ...defaultObserver, next: observer });
    } else {
      return this._subscribe({ ...defaultObserver, ...observer });
    }
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

export function fromEvent(element, event) {
  return new Observable(observer => {
    const handler = e => observer.next(e);
    element.addEventListener(event, handler);
  });
}

