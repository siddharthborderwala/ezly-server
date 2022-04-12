import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const logout =
  (_: FastifyInstance) => async (_: FastifyRequest, reply: FastifyReply) => {
    return reply.clearCookie('token').status(204).send();
  };
