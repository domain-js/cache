const LRU = require("lru-cache");

function Main(cnf, deps) {
  const { _ } = deps;
  const lru = LRU(cnf.cache);

  lru.caching = (fn, life, getKey, isAsync = true) => {
    if (!_.isFunction(fn)) throw Error("The first argument must be a function");
    if (!_.isNumber(life)) throw Error("The second argument must be a number and great then 0");
    if (!_.isFunction(getKey)) throw Error("The third argument must be a function");

    return (...args) => {
      const key = getKey(...args);
      if (lru.has(key)) return lru.get(key);
      let res;
      if (isAsync) {
        res = await fn(...args);
      } else {
        res = fn(...args);
      }

      lru.set(key, res, life);

      return res;
    };
  };

  return lru;
}

Main.Deps = ["_"];

module.exports = Main;
