import { Tedis } from 'tedis';

// Use TypeScript module augmentation to declare the type of server.redis to be Tedis
declare module 'fastify' {
  interface FastifyInstance {
    redis: Tedis;
  }
}
