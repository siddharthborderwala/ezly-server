import Fastify from 'fastify';
import sensible from 'fastify-sensible';
import cookie from 'fastify-cookie';
import { fastifyRequestContextPlugin } from 'fastify-request-context';

import authPlugin from './plugins/auth';
import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';
import AuthenticationRouter from './routes/authentication';
import LinksRouter from './routes/links';

const app = Fastify({
  logger:
    process.env.NODE_ENV === 'development' ? { prettyPrint: true } : false,
});

app.register(sensible);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {
    sameSite: 'strict',
    signed: true,
  },
});
app.register(fastifyRequestContextPlugin, {
  defaultStoreValues: {
    user: null,
  },
});

app.register(authPlugin);
app.register(prismaPlugin);
// app.register(redisPlugin);

app.get('/', async (req, reply) => {
  reply.status(200).send('hello world');
});

app.get('/ping', async (req, reply) => {
  reply.status(200).send('pong');
});

app.register(AuthenticationRouter, {
  prefix: '/api/v1/auth',
});

app.register(LinksRouter, {
  prefix: '/api/v1/links',
});

app.get('/:alias', async (req, reply) => {
  console.log(req.params);
  reply.status(200).send();
});

export default app;
