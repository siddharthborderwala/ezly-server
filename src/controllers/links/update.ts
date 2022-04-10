import { linkHelper } from './../../util/link';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type UpdateLinkType = {
  linkId: string;
  url: string;
};

export const updateLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { linkId, url } = request.body as UpdateLinkType;
    const { id }: { id: string } = request.requestContext.get('user');

    try {
      const links = await fastify.prisma.link.findMany({
        where: {
          id: linkId,
          user_id: id,
        },
      });

      if (links.length === 0) {
        return reply.status(401).send('user not authorized to delete link');
      }

      const link = links[0];

      const linkClient = linkHelper(fastify.redis);

      await linkClient.update(link.short_url, link.url);

      const updatedLink = await fastify.prisma.link.update({
        where: {
          id: linkId,
        },
        data: {
          url,
        },
      });

      return reply.status(201).send({
        msg: 'url updated successfully',
        link: updatedLink,
      });
    } catch (err) {
      return reply.badRequest('error in updating link');
    }
  };
