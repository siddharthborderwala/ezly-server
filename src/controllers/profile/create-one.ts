import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const createOneProfile =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.params as { username: string };

    try {
      const profile = await fastify.prisma.profile.create({
        data: {
          username,
        },
      });

      return reply.status(200).send({ profile });
    } catch (err) {
      return reply.badRequest('error in getting link');
    }
  };
