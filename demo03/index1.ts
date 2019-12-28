import { of } from './core';

const dataStream$ = of(1, 2, 3)

dataStream$.subscribe(console.log);