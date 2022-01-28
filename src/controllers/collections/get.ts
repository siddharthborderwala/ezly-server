import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getCollections =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');

    try {
      const collections = await fastify.prisma.collection.findMany({
        where: {
          user_id: id,
        },
        include: {
          links: true,
          user: true,
        },
      });

      return reply.status(200).send({
        collections,
      });
    } catch (err) {
      return reply.badRequest('error while retreiving all collections');
    }
  };
