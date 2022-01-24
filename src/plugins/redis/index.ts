import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Tedis } from 'tedis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Tedis;
  }
}

const tedisPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const redis = new Tedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
  });

  // Make Redis Client available through the fastify server instance: server.redis
  server.decorate('redis', redis);
  server.addHook('onClose', async (server) => {
    redis.close();
  });
});

export default tedisPlugin;
