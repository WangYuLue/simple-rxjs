import { from, timer, interval } from './core';

const dataStream1$ = from([1, 2, 3]);

const dataPromise = new Promise((res) => {
  setTimeout(() => {
    res('dataPromise');
  }, 1500)
})

const dataStream2$ = from(dataPromise);

const dataStream3$ = timer(1000);

const dataStream4$ = interval(1000);

setTimeout(() => {
  console.log('===== test from =====');
  dataStream1$.subscribe(console.log);
  dataStream2$.subscribe(console.log);
}, 1000)

setTimeout(() => {
  console.log('===== test timer =====');
  dataStream3$.subscribe(console.log);
}, 3000)

setTimeout(() => {
  console.log('===== test interval =====');
  dataStream4$.subscribe(console.log);
}, 5000)
