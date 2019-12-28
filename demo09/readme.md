## 实现工具类操作符 tap 和过滤类操作符 take

take目前有些小问题，尝试运行如下代码：

```js
const dataStream1$ = of(1,2,3,4,5);

const dataStream2$ = dataStream1$.pipe(
  map(data => data * 2),
  filter(data => data > 3),
  tap(data => console.log(`side effect:data${data}`)),
  take(2),
)

dataStream2$.subscribe(console.log);
```