import { aliasHelper, linkHelper } from './../../util/link';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type CreateLinkType = {
  isAlias: boolean;
  alias?: string;
  url: string;
  collectionName?: string;
};

export const createLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');
    const {
      isAlias,
      url,
      collectionName = 'general',
      alias = '',
    } = request.body as CreateLinkType;

    try {
      const collection = await fastify.prisma.collection.findMany({
        where: {
          name: collectionName,
          user_id: id,
        },
      });

      console.log(collection);

      if (collection.length === 0) {
        return reply.badRequest('no such collection exists');
      }

      if (isAlias) {
        const aliasClient = aliasHelper(alias, fastify.redis);

        if (!aliasClient.validate()) {
          return reply.badRequest('incorrect alias provided');
        }

        const exists = await aliasClient.alreadyExists();

        if (exists) {
          return reply.badRequest('alias already in use');
        }

        await aliasClient.setAlias(url);
        await fastify.prisma.link.create({
          data: {
            user_id: id,
            collection_id: collection[0].id,
            short_url: alias,
            url,
          },
        });

        return reply.status(201).send({
          msg: 'alias created successfully',
          alias,
          url,
        });
      } else {
        const shortUrl = await linkHelper(url, fastify.redis).addLink();
        await fastify.prisma.link.create({
          data: {
            user_id: id,
            collection_id: collection[0].id,
            short_url: shortUrl,
            url,
          },
        });

        return reply.status(201).send({
          msg: 'short created successfully',
          shortUrl,
          url,
        });
      }
    } catch (err) {
      console.log(err);
      return reply.badRequest('error while creating short url');
    }
  };
