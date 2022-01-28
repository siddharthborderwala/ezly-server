import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getOneLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { linkId }: any = request.params;

    try {
      const link = await fastify.prisma.link.findFirst({
        where: {
          id: linkId,
        },
      });

      return reply.status(200).send({ link });
    } catch (err) {
      return reply.badRequest('error in getting link');
    }
  };
