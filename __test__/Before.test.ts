import { Before } from "../src/Before";

describe("cache", () => {
  const logger = {
    info: jest.fn(),
    error: jest.fn(),
  };
  const deps = { logger };
  describe("Before, isMulti be false", () => {
    const cnf = {};
    it("case1", () => {
      expect(Before(cnf, deps)).toEqual([cnf, deps]);
    });
  });

  describe("After, isMulti be true", () => {
    const cnf = { cache: { isMulti: true } };
    it("case1", () => {
      const args = Before(cnf, deps);
      expect(args[0]).toEqual(cnf);
      expect(args[1]).toEqual(deps);
    });
  });
});
