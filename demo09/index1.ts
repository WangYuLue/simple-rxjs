import { of, map, filter, tap, take, interval, from } from './core';

const dataStream1$ = of(1, 2, 3, 4, 5);

const dataStream2$ = dataStream1$.pipe(
  map(data => data * 2),
  filter(data => data > 3),
  take(2),
  tap(data => console.log(`side effect:data${data}`))
)

dataStream2$.subscribe(console.log);