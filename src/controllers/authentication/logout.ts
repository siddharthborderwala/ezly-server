import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const logout =
  (_: FastifyInstance) => async (_: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('token');
    reply.status(204).send();
  };
