import { Tedis } from 'tedis';
import { nanoid } from 'nanoid';

const URL_LENGTH = 10;

export const linkHelper = (redis: Tedis) => {
  return {
    async create(url: string) {
      const id = nanoid(URL_LENGTH);
      await redis.set(id, url);
      return id;
    },
    delete(key: string) {
      return redis.del(key);
    },
    createAlias(alias: string, url: string) {
      return redis.set(alias, url);
    },
    validateAlias(alias: string) {
      return alias.length >= 3;
    },
    exists(key: string) {
      return redis.exists(key);
    },
    get(shortUrl: string) {
      return redis.get(shortUrl);
    },
    update(short_url: string, url: string) {
      return redis.set(short_url, url);
    },
  };
};
