import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type CreateCollectionType = {
  name: string;
};

export const createCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');

    const { name = '' } = request.body as CreateCollectionType;

    try {
      const collections = await fastify.prisma.collection.findMany({
        where: {
          name: name.trim(),
          user_id: id,
        },
      });

      if (collections.length > 0) {
        return reply.badRequest('collection with name already exists');
      }

      const collection = await fastify.prisma.collection.create({
        data: {
          name,
          user_id: id,
        },
      });

      return reply.status(201).send({
        msg: `collection ${name} created successfully`,
        name,
        collectionId: collection.id,
      });
    } catch (err) {
      return reply.badRequest('error while creating collection');
    }
  };
