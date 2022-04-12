import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type CreateCollectionType = {
  name: string;
};

export const createCollection =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');

    let { name = '' } = request.body as CreateCollectionType;
    name = name.trim();

    try {
      const collections = await fastify.prisma.collection.findMany({
        where: {
          name,
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
        collection,
      });
    } catch (err) {
      return reply.badRequest('error while creating collection');
    }
  };
