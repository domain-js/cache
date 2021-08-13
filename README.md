# @domain.js/cache
基于 lru-cache 库包封装的适合 @domain.js/domain 的cache模块

[![Build status](https://travis-ci.com/domain-js/cache.svg?branch=master)](https://travis-ci.org/domain-js/cache)
[![codecov](https://codecov.io/gh/domain-js/cache/branch/master/graph/badge.svg)](https://codecov.io/gh/domain-js/cache)

# Installation
<pre>npm i @domain.js/cache --save</pre>

# cnf
专属配置名称 `cache`
* [参考 lru-cache option](https://github.com/isaacs/node-lru-cache)

# deps
| 模块名 | 别名 | 用到的方法 | 描述 |
| ------ | ---- | ---------- | ---- |
| _ | `无` | `不确定` | lodash |


# Usage
* [参考 lru-cache option](https://github.com/isaacs/node-lru-cache)
* `caching` 自动将某个函数处理成具有cache特性的函数，保持原函数行为不变

```javascript
const fn = (...args) => { // do something };
const keyFn = (...args) => `cache-${args[0]}-${args[1]}`;
const isAsync = true;
const fn1 = cache.caching(fn, lifeMS, keyFn, isAsync);

const res = await fn1(1, 2);
const res2 = await fn1(1, 2); // 第二次执行的时候返回的是第一次的cache
```

