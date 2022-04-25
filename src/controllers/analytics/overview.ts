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

      const userLinks = await fastify.prisma.link.findMany({
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

      const clicks = userLinks.reduce((acc, curr) => {
        return acc + curr._count.analytics;
      }, 0);

      const latestLink = await fastify.prisma.link.findFirst({
        where: {
          user_id: id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          short_url: true,
          collection: {
            select: {
              name: true,
            },
          },
        },
      });

      const popularLink = await fastify.prisma.link.findFirst({
        where: {
          user_id: id,
        },
        orderBy: {
          analytics: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          short_url: true,
          collection: {
            select: {
              name: true,
            },
          },
        },
      });

      return reply.status(200).send({
        collections,
        links,
        clicks,
        latestLink: latestLink && {
          id: latestLink.id,
          url: `https://ezly.tech/${latestLink.short_url}`,
          collection: latestLink.collection.name,
        },
        popularLink: popularLink && {
          id: popularLink.id,
          url: `https://ezly.tech/${popularLink.short_url}`,
          collection: popularLink.collection.name,
        },
      });
    } catch (err) {
      console.log(err);

      return reply.badRequest('error while retrieving res');
    }
  };
