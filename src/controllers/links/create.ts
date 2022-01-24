import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type CreateLinkType = {
  isAlias: boolean;
  alias?: string;
  
};

export const createLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {};
