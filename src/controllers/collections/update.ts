import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type UpdateCollectionType = {
  collectionId: string;
  collectionName: string;
};

export const updateCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');
    const { collectionId, collectionName } =
      request.body as UpdateCollectionType;

    try {
      const collections = await fastify.prisma.collection.findMany({
        where: {
          id: collectionId,
          user_id: id,
        },
      });

      if (collections.length === 0) {
        return reply
          .status(401)
          .send('user not authorized to update collection');
      }

      const collection = await fastify.prisma.collection.update({
        data: {
          name: collectionName,
        },
        where: {
          id: collectionId,
        },
      });

      return reply.status(200).send({
        collection,
        msg: 'collection updated successfully',
      });
    } catch (err) {
      return reply.badRequest('error while updating the collection');
    }
  };
