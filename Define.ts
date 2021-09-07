import * as LRU from "lru-cache";
import * as Redis from "ioredis";

export interface CnfDef {
  cache?: {
    isMulti?: boolean;
    delSignalChannel?: string;
  } & LRU.Options<string, string>;
  redis: any;
}

export interface DepsDef {
  logger: {
    info(message: string, extra?: any): void;
    error(error: Error, extra?: any): void;
  };
}

export interface PubSubDef {
  pub: Redis.Redis;
  sub: Redis.Redis;
}
