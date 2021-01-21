const Cache = require("open-cached");

function Main(nf, deps) {
  const { redis, _ } = deps;

  return new Cache(redis, _);
}

Main.Deps = ["redis"];

module.exports = Main;
