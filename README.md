# @domain.js/cache
基于 lru-cache 库包封装的适合 @domain.js/domain 的cache模块

[![Build status](https://travis-ci.com/domain-js/cache.svg?branch=master)](https://travis-ci.com/domain-js/cache)
[![codecov](https://codecov.io/gh/domain-js/cache/branch/master/graph/badge.svg)](https://codecov.io/gh/domain-js/cache)

# Installation
<pre>npm i @domain.js/cache --save</pre>

# cnf
专属配置名称 `cache`
| 名称 | 类型 | 必填 | 默认值 | 描述 | 样例 |
| ---- | ---- | ---- | ------ | ---- | ---- |
| isMulti | boolean | `否` | `false` | 是否为多节点分布式部署 | true |
| delSignalChannel | string | `否` | `LRU_DEL_SIGNAL_CHANNEL` | 多节点广播cache删除信息的渠道名称，借助于 redis(pub/sub) | __CHANNEL__ |

额外配置名称 `redis`, 参考 @domain.js/redis 


* [参考 lru-cache option](https://github.com/isaacs/node-lru-cache)

# deps
| 模块名 | 别名 | 用到的方法 | 描述 |
| ------ | ---- | ---------- | ---- |
| logger | `无` | `info` | 输出日志 |
| logger | `无` | `error` | 输出错误 |


# Usage
* [参考 lru-cache option](https://github.com/isaacs/node-lru-cache)
* `caching` 自动将某个异步函数(如果是同步函数，加工完后会变成异步)处理成具有cache特性的函数，保持原函数行为不变

```javascript
const fn = (...args) => { // do something };
const keyFn = (...args) => `cache-${args[0]}-${args[1]}`;
const isAsync = true;
const hitFn = (isHit) => { // do hit count, isHit must be `true` or `false` }
const fn1 = cache.caching(fn, lifeMS, keyFn, hitFn);

const res = await fn1(1, 2);
const res2 = await fn1(1, 2); // 第二次执行的时候返回的是第一次的cache
console.log("cache hit stats: %o", cache.hitCount());
```

