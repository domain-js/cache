import { isFunction } from "util";
import * as LRU from "lru-cache";
import * as Redis from "ioredis";
import { CnfDef, DepsDef, PubSubDef } from "./Define";

export { Before } from "./Before";
export { After } from "./After";

export function Main(cnf: CnfDef, deps: DepsDef, pubsub: PubSubDef | null) {
  let hits = 0; // 击中次数
  let misseds = 0; // 未击中次数

  const lru = new LRU<string, string>(cnf.cache);

  function caching<T extends (...args: any[]) => any>(
    func: T,
    life: number,
    getKey: (...args: Parameters<T>) => string,
    hit: (hited: boolean) => void,
  ): T {
    if (!isFunction(func)) throw Error("The first argument must be a function");
    if (!Number.isInteger(life) || life < 1)
      throw Error("The second argument must be a number and great then 0");
    if (!isFunction(getKey)) throw Error("The third argument must be a function");
    if (hit && !isFunction(hit)) throw Error("The fourth argument must be a function");

    const wrapped = (...args: Parameters<T>) => {
      const key = getKey(...args);
      if (lru.has(key)) {
        hits += 1;
        if (hit) hit(true);
        return lru.get(key);
      }
      if (hit) hit(false);
      misseds += 1;
      const res = func(...args);

      lru.set(key, res, life);

      return res;
    };
    return wrapped as T;
  }

  const hitCount = () => ({ hits, misseds });

  const needToBroad = Boolean(pubsub);

  return Object.assign(lru, { caching, hitCount, needToBroad });
}

export const Deps = ["logger"];
