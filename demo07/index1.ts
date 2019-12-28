import { of } from './core';

const dataStream1$ = of(1, 2, 3);

dataStream1$
  .map(data => data * 2)
  .filter(data => data > 3)
  .map(data => data + 1)
  .subscribe(console.log)