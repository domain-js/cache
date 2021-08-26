const LRU = require("lru-cache");
const Before = require("./Before");
const After = require("./After");

function Main(cnf, deps) {
  const { _, logger, graceful } = deps;

  let hits = 0; // 击中次数
  let misseds = 0; // 未击中次数

  const lru = new LRU(cnf.cache);

  lru.caching = (fn, life, getKey, hit) => {
    if (!_.isFunction(fn)) throw Error("The first argument must be a function");
    if (!_.isNumber(life) || life < 1)
      throw Error("The second argument must be a number and great then 0");
    if (!_.isFunction(getKey)) throw Error("The third argument must be a function");
    if (hit && !_.isFunction(hit)) throw Error("The fourth argument must be a function");

    return async (...args) => {
      const key = getKey(...args);
      if (lru.has(key)) {
        hits += 1;
        if (hit) hit(true);
        return lru.get(key);
      }
      if (hit) hit(false);
      misseds += 1;
      const res = await fn(...args);

      lru.set(key, res, life);

      return res;
    };
  };

  lru.hitCount = () => ({ hits, misseds });

  graceful.exit(() => {
    logger.info("System exiting cache stats", { hits, misseds });
  });

  return lru;
}

Main.Before = Before;
Main.After = After;
Main.Deps = ["_", "logger", "graceful"];

module.exports = Main;
