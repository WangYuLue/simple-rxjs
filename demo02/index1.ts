import { of } from './core';

const dataStream$ = of(1, 2, 3)

const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}

dataStream$.subscribe(observer);