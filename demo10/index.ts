import { interval } from 'rxjs';
import { merge, take, map } from 'rxjs/operators';

const dataStream1$ = interval(100).pipe(take(3), map(() => '1'));
const dataStream2$ = interval(160).pipe(take(3), map(() => '2'));

const dataStream3$ = dataStream1$.pipe(
  merge(dataStream2$)
)

dataStream3$.subscribe(console.log);