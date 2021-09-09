import { Before } from "../src/Before";

describe("cache", () => {
  const sub = {
    on: jest.fn(),
    subscribe: jest.fn(),
  };
  const pub = {
    publish: jest.fn(),
  };
  const logger = {
    info: jest.fn(),
    error: jest.fn(),
  };
  const deps = { logger };
  describe("Before, isMulti be false", () => {
    const cnf = {};
    it("case1", () => {
      const lru = { del: jest.fn() };
      expect(Before(cnf, deps)).toEqual([cnf, deps, null]);
    });
  });

  describe("After, isMulti be true", () => {
    const cnf = { cache: { isMulti: true } };
    it("case1", () => {
      const lru = { del: jest.fn() };
      const args = Before(cnf, deps);
      expect(args[0]).toEqual(cnf);
      expect(args[1]).toEqual(deps);
    });
  });
});
