import Fastify from 'fastify';

import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';

const app = Fastify({
  logger: true,
});

// app.register(prismaPlugin);
// app.register(redisPlugin);

app.get('/', async (req, reply) => {
  reply.status(200).send('hello world');
});

app.get('/ping', async (req, reply) => {
  reply.status(200).send('pong');
});

app.get('/:alias', async (req, reply) => {
  console.log(req.params);
  reply.status(200).send();
});

export default app;
