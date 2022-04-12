import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getOneCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { collectionName }: any = request.params;
    const { id }: { id: string } = request.requestContext.get('user');

    try {
      const collection = await fastify.prisma.collection.findFirst({
        where: {
          name: collectionName,
          user_id: id,
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
