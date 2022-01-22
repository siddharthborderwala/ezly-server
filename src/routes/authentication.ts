import { FastifyInstance } from 'fastify';
import { register, login } from '../controllers/authentication';

const AuthenticationRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post('/register', register(fastify));
  fastify.post('/login', login(fastify));
};

export default AuthenticationRouter;
