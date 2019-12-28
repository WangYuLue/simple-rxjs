import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const dataStream1$ = of(1, 2, 3);

const dataStream2$ = dataStream1$.pipe(
  map(data => data * 2),
  filter(data => data > 3),
  map(data => data + 1),
)

dataStream2$.subscribe(console.log);