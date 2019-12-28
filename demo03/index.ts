import { of } from 'rxjs';

const dataStream$ = of(1, 2, 3)

dataStream$.subscribe(console.log);