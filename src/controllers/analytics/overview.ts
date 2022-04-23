import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const overview =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: { id: string } = request.requestContext.get('user');
    try {
      const collections = await fastify.prisma.collection.count({
        where: {
          user_id: id,
        },
      });

      const links = await fastify.prisma.link.count({
        where: {
          user_id: id,
        },
      });

      const totalClicks = await fastify.prisma.link.findMany({
        where: {
          user_id: id,
        },
        include: {
          _count: {
            select: {
              analytics: true,
            },
          },
        },
      });

      const clicks = totalClicks.reduce((acc, curr) => {
        return acc + curr._count.analytics;
      }, 0);

      // TODO - Add profile views

      return reply.status(200).send({ collections, links, clicks });
    } catch (err) {
      return reply.badRequest('error while retreiving res');
    }
  };
