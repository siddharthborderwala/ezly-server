import { Tedis } from 'tedis';
import { nanoid } from 'nanoid';

const URL_LENGTH = 10;

export const linkHelper = (url: string, redis: Tedis) => {
  return {
    // TODO Maybe add check if shortid generates identical, very unlikely tho
    async create() {
      const id = nanoid(URL_LENGTH);
      await redis.set(id, url);
      return id;
    },
    delete(key: string) {
      return redis.del(key);
    },
    createAlias(alias: string) {
      return redis.set(alias, url);
    },
    validateAlias(alias: string) {
      return alias.length >= 3;
    },
    exists(key: string) {
      return redis.exists(key);
    },
  };
};
