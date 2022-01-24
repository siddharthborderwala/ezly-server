import { Tedis } from 'tedis';
import { nanoid } from 'nanoid';

const URL_LENGTH = 10;

export const linkHelper = (url: string, redis: Tedis) => {
  return {
    async addLink() {
      // TODO Remove this loop if it seems extra
      const id = nanoid(URL_LENGTH);
      console.log('generated id => ', id);
      const exists = await redis.exists(id);
      if (exists === 0) {
        await redis.set(id, url);
        return {
          shortUrl: id,
        };
      }
      // while (true) {}
    },
  };
};

export const aliasHelper = (alias: string, redis: Tedis) => {
  return {
    alreadyExists() {
      return redis.exists(alias);
    },
    setAlias(url: string) {
      return redis.set(alias, url);
    },
    // TODO Maybe add more validations
    validate() {
      return alias.length > 3;
    },
  };
};
