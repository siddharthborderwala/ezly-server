import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { linkHelper } from '../../util/link';

type DeleteLinkType = {
  short_url: string;
};

export const deleteLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { short_url } = request.body as DeleteLinkType;

    try {
      const linkClient = linkHelper(fastify.redis);

      const link = await fastify.prisma.link.findUnique({
        where: {
          short_url,
        },
      });

      if (!link) {
        return reply.status(404).send('link does not exist');
      }

      await linkClient.delete(link.short_url);

      await fastify.prisma.link.delete({
        where: {
          short_url,
        },
      });

      return reply.status(200).send({
        msg: 'link deleted successfully',
      });
    } catch (err) {
      return reply.badRequest('error while deleting link');
    }
  };
