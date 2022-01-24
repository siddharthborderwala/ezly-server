import { Tedis } from 'tedis';
import { nanoid } from 'nanoid';

const URL_LENGTH = 10;

export const linkHelper = (url: string, redis: Tedis) => {
  return {
    // TODO Maybe add check if shortid generates identical, very unlikely tho
    async addLink() {
      const id = nanoid(URL_LENGTH);
      await redis.set(id, url);
      return id;
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
