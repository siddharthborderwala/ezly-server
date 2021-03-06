import { FastifyInstance } from 'fastify';
import { register, login, logout, getme } from '../controllers/authentication';

const authResponse = {
  200: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          email: { type: 'string' },
        },
      },
      token: { type: 'string' },
    },
  },
};

const registerOpts = {
  schema: {
    description: 'Register route',
    tags: ['auth'],
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        passwordConfirmation: {
          type: 'string',
        },
      },
    },
    response: authResponse,
  },
};

const loginOpts = {
  schema: {
    description: 'Login route',
    tags: ['auth'],
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
    response: authResponse,
  },
};

const AuthenticationRouter = async (fastify: FastifyInstance) => {
  fastify.get(
    '/me',
    {
      preHandler: [fastify.verifyJWT],
    },
    getme(fastify)
  );

  fastify.post('/register', registerOpts, register(fastify));

  fastify.post('/login', loginOpts, login(fastify));

  fastify.post(
    '/logout',
    {
      preHandler: [fastify.verifyJWT],
    },
    logout(fastify)
  );
};

export default AuthenticationRouter;
