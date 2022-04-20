import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { linkHelper, removeHttp } from './../../util/link';

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

    let cleanedUrl = removeHttp(url);

    console.log('cleaned url = ', cleanedUrl);

    try {
      const linkClient = linkHelper(fastify.redis);
      let shortUrl;

      const collections = await fastify.prisma.collection.findMany({
        where: {
          name: collectionName,
          user_id: id,
        },
      });

      if (collections.length === 0) {
        return reply.badRequest('no such collection exists');
      }

      const collection = collections[0];

      if (isAlias) {
        if (!linkClient.validateAlias(alias)) {
          return reply.badRequest(
            'incorrect alias provided, use only alphanumeric and length should be greater than 3'
          );
        }

        const exists = await linkClient.exists(alias);

        if (exists) {
          return reply.badRequest('alias already in use');
        }

        await linkClient.createAlias(alias, url);
        await fastify.prisma.link.create({
          data: {
            user_id: id,
            collection_id: collection.id,
            short_url: alias,
            url: cleanedUrl,
          },
        });

        shortUrl = alias;
      } else {
        shortUrl = await linkClient.create(url);
        await fastify.prisma.link.create({
          data: {
            user_id: id,
            collection_id: collection.id,
            short_url: shortUrl,
            url: cleanedUrl,
          },
        });
      }

      return reply.status(201).send({
        msg: 'short url created successfully',
        shortUrl,
        url: cleanedUrl,
        collectionId: collection.id,
      });
    } catch (err) {
      return reply.badRequest('error while creating short url');
    }
  };
