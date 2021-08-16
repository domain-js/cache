module.exports = (lru, cnf, deps, pubsub) => {
  const { cache = {} } = cnf;
  const { isMulti = false, delSignalChannel = "LRU_DEL_SIGNAL_CHANNEL" } = cache;
  // 如果不是多节点分部署部署，则不需要处理
  // 开启多节点分布式部署后，要通过redis广播cache的del事件，依次来保持cache的有效性
  if (!isMulti) return;

  const { logger } = deps;
  const { pub, sub } = pubsub;

  sub.subscribe(delSignalChannel, (err, count) => {
    logger.info("cache.redis.subscribe", { chanels: delSignalChannel, count });
    if (err) return logger.error(err);
    return logger.info(`cache.redis.subscribe succeed, channel count: ${count}`);
  });

  const del = lru.del.bind(lru);
  lru.del = (key) => {
    pub.publish(delSignalChannel, key);
  };

  sub.on("message", async (channel, key) => {
    if (channel === delSignalChannel) del(key);
  });
};
