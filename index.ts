import { isFunction } from "util";
import * as LRU from "lru-cache";
import { Cnf } from "./Define";
export { Before } from "./Before";
export { After } from "./After";

export function Main(cnf: Cnf) {
  let hits = 0; // 击中次数
  let misseds = 0; // 未击中次数

  const lru = new LRU<string, string>(cnf.cache);

  const caching = (
    fn: Function,
    life: number,
    getKey: (...args: any[]) => string,
    hit: (hited: boolean) => void,
  ) => {
    if (!isFunction(fn)) throw Error("The first argument must be a function");
    if (!Number.isInteger(life) || life < 1)
      throw Error("The second argument must be a number and great then 0");
    if (!isFunction(getKey)) throw Error("The third argument must be a function");
    if (hit && !isFunction(hit)) throw Error("The fourth argument must be a function");

    return async (...args: any): Promise<any> => {
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

  const hitCount = () => ({ hits, misseds });

  return Object.assign(lru, { caching, hitCount });
}

export const Deps = ["logger"];
