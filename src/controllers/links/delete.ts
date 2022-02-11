import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { linkHelper } from '../../util/link';

type DeleteLinkType = {
  linkId: string;
};

export const deleteLink =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');
    const { linkId } = request.body as DeleteLinkType;

    try {
      const linkClient = linkHelper(fastify.redis);

      const links = await fastify.prisma.link.findMany({
        where: {
          id: linkId,
          user_id: id,
        },
      });

      if (links.length === 0) {
        return reply.status(401).send('user not authorized to delete link');
      }

      await linkClient.delete(links[0].short_url);
      await fastify.prisma.link.delete({
        where: {
          id: linkId,
        },
      });

      return reply.status(200).send({
        msg: 'link deleted successfully',
      });
    } catch (err) {
      return reply.badRequest('error while deleting link');
    }
  };
