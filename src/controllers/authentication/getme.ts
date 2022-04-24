import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getme =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.requestContext.get('user') as { id: string };

    try {
      const user = await fastify.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return reply.status(404).send('user not found');
      }

      reply.status(200).send({
        id: id,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      reply.status(400).send('bad request');
    }
  };
