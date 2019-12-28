import { from, timer, interval } from 'rxjs';

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
  const subscription1 = dataStream1$.subscribe(console.log);
  const subscription2 = dataStream2$.subscribe(console.log);
  subscription1.unsubscribe();
  subscription2.unsubscribe();
}, 1000)

setTimeout(() => {
  console.log('===== test timer =====');
  const subscription3 = dataStream3$.subscribe(console.log);
  subscription3.unsubscribe();
}, 3000)

setTimeout(() => {
  console.log('===== test interval =====');
  const subscription4 = dataStream4$.subscribe(console.log);
  subscription4.unsubscribe();
}, 5000)
