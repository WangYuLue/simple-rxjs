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

/**
 * @param param array or promise
 */
export function from(param) {
  if (Array.isArray(param)) {
    return new Observable(observer => {
      param.forEach(val => observer.next(val));
      observer.complete();
    });
  }
  return new Observable(observer => {
    Promise.resolve(param)
      .then(val => {
        observer.next(val);
        observer.complete();
      })
      .catch(e => {
        observer.error(e);
      });
  })
}

export function interval(delay) {
  return new Observable(observer => {
    let index = 0;
    setInterval((() => {
      observer.next(index++)
    }), delay)
  })
}

export function timer(delay) {
  return new Observable(observer => {
    setTimeout((() => {
      observer.next(0)
    }), delay)
  })
}