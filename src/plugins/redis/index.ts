import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Tedis } from 'tedis';

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const redis = new Tedis({
    host: '127.0.0.1',
    port: 6379,
    password: 'password',
  });

  // Make Redis Client available through the fastify server instance: server.redis
  server.decorate('redis', redis);
  server.addHook('onClose', async (server) => {
    redis.close();
  });
});

export default prismaPlugin;
