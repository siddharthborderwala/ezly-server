import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getStats =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { alias }: any = request.params;
    try {
      const stats = await fastify.prisma.link.findFirst({
        where: {
          short_url: alias,
        },
        include: {
          Analytics: true,
        },
      });
      // console.log(stats);
      return reply.status(200).send({
        stats,
      });
    } catch (err) {
      return reply.badRequest('error while retreiving stats');
    }
  };
