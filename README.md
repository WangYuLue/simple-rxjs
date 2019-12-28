## 简介 

**200行代码理解rxjs的核心概念**

rxjs非常强大，各种操作符连接在一起便能让数据流动到需要用到它的地方，有人甚至觉得 rxjs 是魔法；

然而，太阳底下无新事，本教程将一步步揭开rxjs的神秘面纱；

本教程会通过 10 个有趣的小 demo 渐进式的实现rxjs的核心功能，其中包括：

* 类：`Observable` 的实现
* 类的方法：`subscribe`,`pipe` 的实现
* 创建类操作符：`of`,`from`,`fromEvent`,`interval`,`timer` 的实现
* 过滤类操作符：`filter`,`take` 的实现
* 工具类操作符：`tap` 的实现
* 组合类操作符：`merge` 的实现

其中还包括 rxjs5链式调用 和 rxjs6通过pipe来调用 的各自实现

而这一切，只有200行不到的代码，如果感兴趣，开始你的愉快之旅吧！

## 如何使用？

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

## 文件结构

每个 demo 文件夹下会有 4个文件，其中：

* `core.ts` 是当前阶段实现的rxjs的核心代码
* `index.ts` 是引用官方rxjs写的测试代码
* `index1.ts` 是引用前阶段实现的rxjs写的测试代码
* `readme.md` 是对于当前阶段代码改动的介绍

可以发现 `index.ts` 和 `index1.ts` 中，除了引用不同，代码没有任何不同。

这样做是为了方便对比官方rxjs和自己实现rxjs的运行效果。

## Demo01: 实现一个 Observable

## Demo02: 实现创建类操作符 of

## Demo03: Observable.subscribe 可以传人一个方法作为参数

## Demo04: 实现创建类操作符 fromEvent

## Demo05: 实现创建类操作符 from、interval、timer

## Demo06: 为创建类操作符添加取消订阅功能

## Demo07: 实现转换类操作符 map 和过滤类操作符 filter（链式调用实现）

## Demo08: 实现转换类操作符 map 和过滤类操作符 filter（pipe调用实现）

## Demo09: 实现工具类操作符 tap 和过滤类操作符 take

## Demo10: 实现组合类操作符 merge