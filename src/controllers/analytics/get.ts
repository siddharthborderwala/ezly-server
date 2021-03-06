import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { calcAnalytics } from '../../util/calculateAnalytics';

export const getStats =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { alias } = request.params as { alias: string };
    const { id }: { id: string } = request.requestContext.get('user');
    try {
      const res = await fastify.prisma.link.findFirst({
        where: {
          short_url: alias,
          user_id: id,
        },
        include: {
          analytics: true,
          collection: true,
        },
      });

      if (!res) {
        return reply.status(404).send('Data not found');
      }

      const stats = {
        url: res.url,
        alias: res.short_url,
        clicks: res.analytics.length,
        collection: res?.collection.name,
        analytics: res.analytics.length > 0 ? calcAnalytics(res.analytics) : [],
      };

      return reply.status(200).send({
        stats,
      });
    } catch (err) {
      return reply.badRequest('error while retreiving res');
    }
  };
