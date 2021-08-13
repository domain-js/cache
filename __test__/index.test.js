const _ = require("lodash");
const Cache = require("..");

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe("cache", () => {
  const cnf = {
    cache: {
      max: 2,
    },
  };
  const deps = { _ };
  describe("caching", () => {
    const fn = jest.fn(async (a, b) => {
      await sleep(300);
      return a + b;
    });
    const cache = Cache(cnf, deps);
    it("case1", async () => {
      const fn1 = cache.caching(fn, 10 * 1000, (a, b) => `fn-${a}-${b}`);
      // 第一次执行，没有cache，函数会真实的执行
      expect(await fn1(2, 3)).toBe(5);
      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls.pop()).toEqual([2, 3]);
      // 第二次执行有cache了，函数不会真实执行，直接从cache中得到结果
      expect(await fn1(2, 3)).toBe(5);
      expect(fn.mock.calls.length).toBe(0);

      // 参数不一致，cache 的key不一样，因此依然会执行
      expect(await fn1(3, 2)).toBe(5);
      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls.pop()).toEqual([3, 2]);

      // 第三次执行不一样的参数的，函数依然会执行，这次执行过后，第一次执行产生的那个cahce会被清掉
      // 因为我设置的max是2
      expect(await fn1(4, 2)).toBe(6);
      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls.pop()).toEqual([4, 2]);

      // 第四次执行和第一次执行的参数完全相同，因为cache数量溢出，因此函数依然会执行
      expect(await fn1(2, 3)).toBe(5);
      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls.pop()).toEqual([2, 3]);
    });

    it("case2", async () => {
      expect(() => cache.caching("hello", 10 * 1000, (a, b) => `fn-${a}-${b}`)).toThrow(
        "must be a function",
      );

      expect(() => cache.caching(fn, "hello", (a, b) => `fn-${a}-${b}`)).toThrow(
        "must be a number and great then 0",
      );

      expect(() => cache.caching(fn, 0, (a, b) => `fn-${a}-${b}`)).toThrow(
        "must be a number and great then 0",
      );

      expect(() => cache.caching(fn, 10, "test")).toThrow("must be a function");
    });
  });
});
