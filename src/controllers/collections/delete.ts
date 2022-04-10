import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type DeleteCollectionType = {
  collectionId: string;
};

export const deleteCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');
    const { collectionId = '' } = request.body as DeleteCollectionType;

    try {
      const collections = await fastify.prisma.collection.findMany({
        where: {
          id: collectionId,
          user_id: id,
        },
      });

      if (collections.length === 0) {
        return reply.status(401).send({
          msg: 'user not authorized to delete collection',
        });
      }

      const collection = collections[0];

      if (collection.name === 'general' || collection.name === 'profile-page') {
        return reply
          .status(401)
          .send('user not authorized to delete this collection');
      }

      const links = await fastify.prisma.link.findMany({
        where: {
          user_id: id,
          collection_id: collectionId,
        },
      });

      await Promise.all(
        links.map((link) => {
          return fastify.redis.del(link.short_url);
        })
      );

      await fastify.prisma.link.deleteMany({
        where: {
          user_id: id,
          collection_id: collectionId,
        },
      });

      await fastify.prisma.collection.delete({
        where: {
          id: collectionId,
        },
      });

      return reply.status(200).send({
        msg: 'collection deleted successfully',
      });
    } catch (err) {
      return reply.badRequest('error while deleting collection');
    }
  };
