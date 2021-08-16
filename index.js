const LRU = require("lru-cache");
const Before = require("./Before");
const After = require("./After");

function Main(cnf, deps) {
  const { _ } = deps;

  const lru = new LRU(cnf.cache);

  lru.caching = (fn, life, getKey) => {
    if (!_.isFunction(fn)) throw Error("The first argument must be a function");
    if (!_.isNumber(life) || life < 1)
      throw Error("The second argument must be a number and great then 0");
    if (!_.isFunction(getKey)) throw Error("The third argument must be a function");

    return async (...args) => {
      const key = getKey(...args);
      if (lru.has(key)) return lru.get(key);
      const res = await fn(...args);

      lru.set(key, res, life);

      return res;
    };
  };

  return lru;
}

Main.Before = Before;
Main.After = After;
Main.Deps = ["_", "logger"];

module.exports = Main;
