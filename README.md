## 简介 

**200行代码理解 RxJS 的核心概念**

RxJS 非常强大，各种操作符连接在一起便能让数据流动到需要用到它的地方，有人甚至觉得 RxJS 是魔法；

然而，太阳底下无新事，本教程将一步步揭开 RxJS 的神秘面纱；

本教程会通过 10 个有趣的小 demo 渐进式的实现 RxJS 的核心功能，其中包括：

* 类：`Observable` 的实现
* 类的方法：`subscribe`,`pipe` 的实现
* 创建类操作符：`of`,`from`,`fromEvent`,`interval`,`timer` 的实现
* 过滤类操作符：`filter`,`take` 的实现
* 工具类操作符：`tap` 的实现
* 组合类操作符：`merge` 的实现

其中还包括 RxJS v5 链式调用 和 RxJS v6 通过 pipe 来调用 的各自实现。

而这一切，只有200行不到的代码，如果感兴趣，开始你的愉快之旅吧！

## 写在前面

### 如何使用？

首先安装依赖：

```
yarn
```

需要注意的是，本教程的demo是用 typescript 写的；

所以，为了方便调试运行，建议使用 `ts-node`，可以通过如下方式安装：

```bash
yarn global add ts-node
```

安装好后，你可以用 `ts-node` 来运行 typescript 文件，例如：

```bash
ts-node demo01/index.ts 
```

这样就可以看到运行结果了;

### 文件结构

每个 demo 文件夹下会有 4个文件，其中：

* `core.ts` 是当前阶段实现的rxjs的核心代码
* `index.ts` 是引用官方rxjs写的测试代码
* `index1.ts` 是引用前阶段实现的rxjs写的测试代码
* `readme.md` 是对于当前阶段代码改动的介绍

可以发现 `index.ts` 和 `index1.ts` 中，除了引用不同，代码没有任何不同。

这样做是为了方便对比官方rxjs和自己实现rxjs的运行效果。

为了保证阅读效果，强烈建议读者边阅读边实验，点击[这里](https://github.com/WangYuLue/simple-rxjs)可以下载源码。

## 1、实现一个 Observable

RxJS 的一切起源与 Observable，Observable 是 RxJS 世界的基石，没有它，响应式无重谈起。

Observable 表示一个可观察对象，他表示一个可调用的未来值或事件的集合。

比如有以下代码：

```ts
import { Observable } from 'rxjs';

const dataStream$ = new Observable(observer => {
  observer.next(1);
  setTimeout(() => {
    observer.next(2);
    observer.complete();
  }, 1000)
  observer.next(3);
});

const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}

dataStream$.subscribe(observer);
```

这段代码引用的是官方的 `Observable`, 它在运行后会首先打印一个1，接着打印一个3，隔一秒后会再打印一个2，最后运行结束

仔细观察 `Observable` 方法，他会接受一个方法传进它的构造函数，这个方法接受一个对象，对象上有 `next`, `error`, `complete` 等属性，但是这个对象是 `Observable` 实例在调用 `subscribe` 方法时才传进去的：

有了上面的思路，我们可以大胆的构造出自己的 `Observable`， 如下：

```ts
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    this._subscribe(observer);
  }
}
```

把官方的 `Observable` 替换成自己的 `Observable` 会发现输出没什么差异。

没错，`Observable` 的核心就是这么简单。到现在，我们只用了9行代码实现便了Rxjs的核心概念之一 —— `Observable`。

## 2、实现创建类操作符 of

创建类操作符中，最容易理解的莫过于 `of`，那么我们就先实现 `of` 操作符。

比如有如下代码：

```ts
import { of } from 'rxjs';

const dataStream$ = of(1, 2, 3)

const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}

dataStream$.subscribe(observer);
```

它在运行后会首先打印一个1，接着打印一个2，再会打印一个3，最后运行结束。

有了前面自己实现的 `Observable`， `of` 的实现就会变得非常简单，它实际上只是 `Observable` 外套了一层包装，本质上还是 `Observable`，实现如下：

```ts
export function of(...args) {
  return new Observable(observer => {
    args.forEach(arg => {
      observer.next(arg);
    })
    observer.complete();
  })
}
```

把官方的 `of` 替换成自己的 `of` ，再配上自己实现的 `Observable`，我们会发现输出和官方一致。

## 3、Observable.subscribe 可以传入一个方法作为参数

官方 `Observable` 的 `subscribe` 可以传入一个函数进去，这样的话写起来会清爽很多，如下：

```ts
import { of } from 'rxjs';

const dataStream$ = of(1, 2, 3)

dataStream$.subscribe(console.log);
```

为了我们的 `Observable` 也能这样的好用，我们可以将 `subscribe` 适当的改造一下，如下：

```ts
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    const defaultObserver = {
      next: () => { },
      error: () => { },
      complete: () => { }
    }
    if (typeof observer === 'function') {
      return this._subscribe({ ...defaultObserver, next: observer });
    } else {
      return this._subscribe({ ...defaultObserver, ...observer });
    }
  }
}
```

这样我们的 `subscribe` 也能只传一个方法进去了，变得相当好用。

## 4、实现创建类操作符 fromEvent

但是，Rxjs 核心要解决的是数据流传输的问题，很多时候，我们的数据源头来自用户的人机交互，比如说点击按钮，这样的话就不得不用到 `fromEvent`，比如如下代码：

```ts
import { fromEvent } from 'rxjs';
import { JSDOM } from 'jsdom';

const element = new JSDOM(`<div>Hello world</div>`).window.document.querySelector('div');

const source$ = fromEvent(element, 'click');

source$.subscribe(console.log);

setTimeout(() => {
  element.click()
}, 1000)
```

为了方便对比和测试，我们引用了 `jsdom`,它的作用是在 `node` 端可以做一些 dom 的相关操作。

以上代码渲染了一个 `Hello world` 的元素盒子，并且在一秒钟之后会点击这个盒子。与此同时，我们又使用了 Rxjs 中的 `fromEvent` 来监听盒子的事件。

为了实现自己的`fromEvent`，我们来分析一下 `fromEvent` 所需要的参数，第一个传的是 dom 元素的实例，第二个则是事件的类型，于是可以猜到， `fromEvent` 内部本质上还是通过原生的 `addEventListener` 来实现的。而且需要注意到，除非自己手动取消订阅，否则`fromEvent`创造的对象永远不会结束，根据这个推测，我们能猜到它的内部很有可能只有 `next` 方法。

有了上述的推断，我们很容易就写出了一个 `fromEvent` 方法，如下：

```ts
export function fromEvent(element, event) {
  return new Observable(observer => {
    const handler = e => observer.next(e);
    element.addEventListener(event, handler);
  });
}
```

连我都惊讶它的实现居然如此简短，但是运行的效果和官方的效果完全一致。

## 5、实现创建类操作符 from、interval、timer

有了上面构造 `of`、`fromEvent` 的基础，那么 `from`、`interval`、`timer` 也将不在话下。

例如，`interval` 操作符可以这样实现：

```ts
export function interval(delay) {
  return new Observable(observer => {
    let index = 0;
    setInterval((() => {
      observer.next(index++)
    }), delay)
  })
}
```

`timer` 操作符可以这样实现：

```ts
export function timer(delay) {
  return new Observable(observer => {
    setTimeout((() => {
      observer.next(0)
    }), delay)
  })
}
```

`from` 操作符的实现稍微比较复杂，因为它可以接受 `Array` 或者 `Promise` 类型的参数：

```ts
export function from(param) {
  if (Array.isArray(param)) {
    return new Observable(observer => {
      param.forEach(val => observer.next(val));
      observer.complete();
    });
  }
  return new Observable(observer => {
    Promise.resolve(param)
      .then(val => {
        observer.next(val);
        observer.complete();
      })
      .catch(e => {
        observer.error(e);
      });
  })
}
```

用我们自己实现的 `from`、`interval`、`timer` 操作符来替换官方的操作符号，会发现执行结果和官方的表现的一致

```ts
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
```

## 6、为创建类操作符添加取消订阅功能

前面的操作复实现的过于顺利，以至于我隐隐觉得不安，是不是忽略了什么东西。

果然，我马上意识到，事情没有这么简单，上面自己实现的操作符，我无法取消订阅它们，处理不好这会造成严重的内存泄漏。

于是我们着手改造，以 `fromEvent` 为例，只需要给 `Observable` 构造函数传入的方法一个返回值，在这个返回值加一个 `unsubscribe` 属性，然后在这个属性中写入取消订阅的操作。

```ts
export function fromEvent(element, event) {
  return new Observable(observer => {
    const handler = e => observer.next(e);
    element.addEventListener(event, handler);
    return {
      unsubscribe: () => element.removeEventListener(event, handler)
    };
  });
}
```

这样的话，我们的 `fromEvent` 就能顺利的取消订阅了。

将上面的操作符都整理一下加上返回值，看看我现阶段的成果：

```ts
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    const defaultObserver = {
      next: () => { },
      error: () => { },
      complete: () => { }
    }
    if (typeof observer === 'function') {
      return this._subscribe({ ...defaultObserver, next: observer });
    } else {
      return this._subscribe({ ...defaultObserver, ...observer });
    }
  }
}

export function of(...args) {
  return new Observable(observer => {
    args.forEach(arg => {
      observer.next(arg);
    })
    observer.complete();
    return {
      unsubscribe: () => { }
    }
  })
}

export function fromEvent(element, event) {
  return new Observable(observer => {
    const handler = e => observer.next(e);
    element.addEventListener(event, handler);
    return {
      unsubscribe: () => element.removeEventListener(event, handler)
    };
  });
}

export function from(param) {
  if (Array.isArray(param)) {
    return new Observable(observer => {
      param.forEach(val => observer.next(val));
      observer.complete();
      return {
        unsubscribe: () => { }
      }
    });
  }
  return new Observable(observer => {
    let canceld = false;
    Promise.resolve(param)
      .then(val => {
        if (!canceld) {
          observer.next(val);
          observer.complete();
        }
      })
      .catch(e => {
        observer.error(e);
      });
    return {
      unsubscribe: () => { canceld = true }
    }
  })
}

export function interval(delay) {
  return new Observable(observer => {
    let index = 0;
    const time = setInterval((() => {
      observer.next(index++)
    }), delay)
    return {
      unsubscribe: () => clearInterval(time)
    }
  })
}

export function timer(delay) {
  return new Observable(observer => {
    const time = setTimeout((() => {
      observer.next(0)
    }), delay)
    return {
      unsubscribe: () => clearInterval(time)
    }
  })
}
```

目前，我们用不到100行的代码基本实现了 `Observable`、`of`、`fromEvent`、`from`、`interval`、`timer`，而且实现的效果非常让人惊艳。

但是我们的旅行还没有结束，接下来，笔者将会实现一些好用的转换类操作符，比如 `map` 和 `filter`。我们将分别用链式调用和pipe调用来分别实现他们，以及对比这两种方式使用的优劣。通过这些对比，我们会明白为什么 rxjs6 为什会使用 pipe 调用 而不延续 rxjs5 的链式调用方法。

## 7、实现转换类操作符 map 和过滤类操作符 filter（链式调用实现）

对于 `map` 和 `filter`，同学们一定很熟悉，因为在Array的原型上就有这两个方法。`map` 表示转换，`filter`表示过滤，在 rxjs 中也是这样的功能，那我们应该如何实现这两个操作符呢？

同学可能暂时一头雾水，但是只要换个问题问，同学们一定手到擒来，**怎么用forEach实现Array中的map和filter？**，这还不简单，于是大笔一挥，有了如下的代码：

```ts
function map(array,fn) {
  const res = [];
  array.forEach(item=>res.push(fn(item)))
  return res;
}

function filter(array,fn) {
  const res = [];
  array.forEach(item=>fn(item)?res.push(item):'')
  return res;
}
```

有了上面的参考，那我们实现rxjs中的 `map` 和 `filter` 就有了很多思路，我们先来考虑链式调用的实现。

有经验的同学肯定知道，上古神器 JQuery 就是典型的链式调用。链式调用有很多优点，特别是写起来非常优雅。

以rxjs5为例，有如下的一串代码：

```ts
const dataStream1$ = of(1, 2, 3);

dataStream1$
  .map(data => data * 2)
  .filter(data => data > 3)
  .map(data => data + 1)
  .subscribe(console.log)
```

仔细观察我们会发现，实现链式调用的关键是 `map` 和 `filter` 的返回值必须也要是 `Observable` 实例，而且 `map` 和 `filter` 需要挂载到实例对象上。

有了上面的思路，并且结合前面 Array 中的 `map` 和 `filter` 的实现，我们尝试写出了 rxjs5 中 `map` 、`filter`的实现，如下：

```ts
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  map(fn) {
    return new Observable(observer => {
      this.subscribe({
        next: val => observer.next(fn(val)),
        error: err => observer.error(err),
        complete: () => observer.complete(),
      })
    })
  }

  filter(fn) {
    return new Observable(observer => {
      this.subscribe({
        next: val => fn(val) ? observer.next(val) : () => { },
        error: err => observer.error(err),
        complete: () => observer.complete(),
      })
    })
  }
}
```

非常完美，之前写的代码片段可以顺利执行，打印出了 5 和 7。

但是我们也发现的了链式调用的缺陷 —— 方法都在实例上。

这也就意味着哪怕仅仅用了一个转换操作符，也将会加载全部操作符。如果实例中的方法比较少，这还能忍受。但是像 rxjs 这样的库，转换类操作符和过滤类操作符加起来有几十种，这样的性能影响是无法忽略的。

而且这样的代码组织方式，打包工具的 `tree shaking` 将无法起作用，于是有了以下的pipe实现。

## 8、实现转换类操作符 map 和过滤类操作符 filter（pipe调用实现）

pipe 的思想出现的是间比链式调用还要早，早在 Unix 中就有了 pipe，在Linux 中，我们也能经常看到 `|` 符号。和前端相关的，有经验的开发同学会知道在 Gulp 也使用了大量的pipe的思想。

以一段 Gulp 的脚本为例：

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```

乍一看和链式调用很像，但是由于 `pipe` 在中间做了一层隔离，实例对象和具体的转换方法解耦，所以完全没有了上面链式调用出现的问题。

rxjs 中的 `pipe` 实现更进一步，它能接受多个参数，参考如下写法：

```ts
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const dataStream1$ = of(1, 2, 3);

const dataStream2$ = dataStream1$
  .pipe(map(data => data * 2))
  .pipe(filter(data => data > 3))
  .pipe(map(data => data + 1))

const dataStream3$ = dataStream1$.pipe(
  map(data => data * 2),
  filter(data => data > 3),
  map(data => data + 1),
)
```

上面的代码中 `dataStream2$` 和 `dataStream3$` 实现的效果完全一致，所以想要pipe调用，核心在于如何实现这个加强版 `pipe` 方法。

一次性实现会有难度，我们可以尝试把这个问题分开，**先实现只接受一个参数的 pipe**，如下：

```ts
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const dataStream1$ = of(1, 2, 3);

const dataStream2$ = dataStream1$
  .pipe(map(data => data * 2))
  .pipe(filter(data => data > 3))
  .pipe(map(data => data + 1))
```

仔细观察 `pipe`, 我们会发现它接收一个 RxJS 操作符的运行结果作为参数，并返回一个 `Observable` 实例。

而且 `map` 和 `filter` 不像之前链式调用那样挂载在 `Observable` 实例上，而仅仅是一个纯函数。

而且这个纯函数会在传入 `pipe` 的时候执行一次，目的是把具体 `map` 的逻辑传进去。然后在 `pipe` 方法里再执行一次，目的是吐出一个 `Observable` 以供后续使用。我们可以猜到 `map` 、 `filter` 这样的操作符实际上是包了两层 "纸" 的 `Observable` 实例。

有了上面的思路，我们简单推断便可以写出如下的代码（完整的代码查看[demo08](https://github.com/WangYuLue/simple-rxjs/tree/master/demo08)）：

```ts
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  // 接受单个参数的 pipe 实现
  pipe(operation) {
    return operation(this);
  }
}

export function filter(fn) {
  return (observable) => (
    new Observable(observer => {
      observable.subscribe({
        next: val => fn(val) ? observer.next(val) : () => { },
        error: err => observer.error(err),
        complete: () => observer.complete(),
      })
    })
  )
}

export function map(fn) {
  return (observable) => (
    new Observable(observer => {
      observable.subscribe({
        next: val => observer.next(fn(val)),
        error: err => observer.error(err),
        complete: () => observer.complete(),
      })
    })
  )
}
```

我们在 pipe 中将 当前的 `Observable` 实例传递给操作符以生成一个新的 `Observable` 实例。经过测试发现，可以完美的运行。就这样，我们实现了可以接收单个参数的 pipe。

接下来我们来 **实现可以接受多个参数的 pipe**，如下：

```ts
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const dataStream1$ = of(1, 2, 3);

const dataStream2$ = dataStream1$.pipe(
  map(data => data * 2),
  filter(data => data > 3),
  map(data => data + 1),
)
```

尝试将上面的 `pipe` 方法做一些改造，从

```ts
pipe(operation) {
  return operation(this);
}
```

变成：

```ts
pipe(operation1,operation2,operation3) {
  return operation3(operation2(operation1(this)));
}
```

我们发现可以完美的运行接受三个参数的 `pipe`, 但是这样实在是太丑陋，而且参数是固定的，于是我们可以再优化一下，如下：

```ts
pipe(...operations) {
  return operations.reduce((prev, fn) => fn(prev), this);
}
```

这样，我们就实现了可以接受任意多参数的 pipe 了，最后写下来才发现，原来一行代码就搞定了。

## 9、tap 、 take 以及 merge 的实现

最后还有 `tap` 、 `take` 以及 `merge` 的实现，实现的原理和前面提到的操作符大同小异。感兴趣的读者可以继续查阅 [demo09](https://github.com/WangYuLue/simple-rxjs/tree/master/demo09) 和 [demo10](https://github.com/WangYuLue/simple-rxjs/tree/master/demo10)，由于篇幅原因，这里就不展开讲了。


## 写在最后

我们通过 10 个有趣的小 demo，不到200行的代码 渐进式的实现 RxJS 的核心功能。

希望读者们阅读完这篇文章后对 RxJS 有更深层次的理解。如果有更优雅的实现方式，欢迎留言区多多交流。

这些 demo 的完整代码可以[点这里](https://github.com/WangYuLue/simple-rxjs)查看，如果感觉这些 demo 写的不错，可以给笔者一个 star，谢谢大家阅读
