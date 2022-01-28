import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getOneCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { collectionId }: any = request.params;

    try {
      const collection = await fastify.prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
        include: {
          links: true,
        },
      });

      return reply.status(200).send({
        collection,
      });
    } catch (err) {
      return reply.badRequest('error while retreiving the collection');
    }
  };
