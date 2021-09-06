import * as LRU from "lru-cache";

export interface Cnf {
  cache?: {
    isMulti?: boolean;
    delSignalChannel?: string;
  } & LRU.Options<string, string>;
  redis: any;
}

export interface Deps {
  logger: {
    info(message: string, extra?: any): void;
    error(error: Error, extra?: any): void;
  };
}
