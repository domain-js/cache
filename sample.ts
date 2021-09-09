import * as M from "./index";

const cnf = {
  cache: {
    max: 2,
  },
  redis: {},
};
const logger = {
  info: jest.fn(),
  error: jest.fn(),
};

const deps = { logger };

function sum(a: number, b: number): Promise<number> {
  return new Promise((resolve) => resolve(a + b));
}
const cache = M.Main(cnf, deps);
const cached = cache.caching(sum, 2000, (a, b) => `cache-${a}-${b}`);

console.log(cached(20, 30));
