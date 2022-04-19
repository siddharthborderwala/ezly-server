import Fastify from 'fastify';
import sensible from 'fastify-sensible';
import cookie from 'fastify-cookie';
import fastifySwagger from 'fastify-swagger';
import { fastifyRequestContextPlugin } from 'fastify-request-context';
import cors from 'fastify-cors';

import authPlugin from './plugins/auth';
import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';
import AuthenticationRouter from './routes/authentication';
import LinksRouter from './routes/links';
import CollectionRouter from './routes/collections';
import AnalyticsRoute from './routes/analytics';
import ImageUploadRouter from './routes/image-upload';

import { FastifyAdapter } from '@bull-board/fastify';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { profilePageQueue, updateProfilePage } from './util/queue';
import TaskQueueRouter from './routes/task-queue';
import ShortURLRouter from './routes/short-url';
import ProfilePageRouter from './routes/profile-page';

const app = Fastify({
  logger:
    process.env.NODE_ENV === 'development' ? { prettyPrint: true } : false,
});

if (process.env.NODE_ENV === 'development') {
  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: [new BullAdapter(profilePageQueue)],
    serverAdapter,
  });

  serverAdapter.setBasePath('/taskui');

  app.register(serverAdapter.registerPlugin(), {
    prefix: 'taskui',
    basePath: 'taskui',
  });
}

app.register(cors, {
  origin: (origin, cb) => {
    if (process.env.NODE_ENV === 'development') {
      cb(null, true);
      return;
    }
    if (
      process.env.NODE_ENV === 'production' &&
      /[\w-]*.ezly.to/.test(origin)
    ) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  },
});

app.register(sensible);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {
    sameSite: 'strict',
    signed: true,
    httpOnly: true,
  },
});

app.register(fastifyRequestContextPlugin, {
  defaultStoreValues: {
    user: null,
  },
});

app.register(fastifySwagger, {
  exposeRoute: process.env.NODE_ENV === 'development', // true for dev env
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Ezly Swagger Docs',
      description: 'Testing the API end points',
      version: '0.1.0',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'auth', description: 'Auth Related end-points' }],
  },
});

app.register(authPlugin);
app.register(prismaPlugin);
app.register(redisPlugin);

app.get('/', (_, reply) => {
  reply.status(200).send('hello world');
});

app.get('/ping', (_, reply) => {
  reply.status(200).send('pong');
});

app.get('/favicon.ico', (_, reply) => {
  reply.notFound();
});

app.register(AuthenticationRouter, {
  prefix: '/api/v1/auth',
});

app.register(LinksRouter, {
  prefix: '/api/v1/links',
});

app.register(CollectionRouter, {
  prefix: '/api/v1/collections',
});

app.register(AnalyticsRoute, {
  prefix: '/api/v1/stats',
});

app.register(ImageUploadRouter, {
  prefix: '/api/v1/image',
});

app.register(TaskQueueRouter, {
  prefix: '/api/v1/task',
});

app.register(ProfilePageRouter, {
  prefix: '/u',
});

app.register(ShortURLRouter);

export default app;
