import { FastifyInstance } from 'fastify';
import { register, login } from '../controllers/authentication';

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
  },
};

const AuthenticationRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post('/register', registerOpts, register(fastify));

  fastify.post('/login', loginOpts, login(fastify));
};

export default AuthenticationRouter;
