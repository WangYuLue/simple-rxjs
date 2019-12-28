import { Observable } from './core';

const dataStream$ = new Observable(observer => {
  observer.next(1);
  setTimeout(() => {
    observer.next(2);
    observer.complete();
  }, 1000)
  observer.next(3);
});

const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}

dataStream$.subscribe(observer);