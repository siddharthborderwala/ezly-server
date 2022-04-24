import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const patchOneProfile =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.params as { username: string };

    try {
      const profile = await fastify.prisma.$transaction(async (prisma) => {
        const oldProfile = await prisma.profile.findUnique({
          where: {
            username,
          },
        });

        if (!oldProfile) {
          throw {
            code: 404,
          };
        }

        let updatedProfile = await prisma.profile.update({
          where: {
            username,
          },
          data: {
            ...oldProfile,
            savedVersion: oldProfile.savedVersion + 1,
            body: (request.body as { body: any }).body,
          },
        });

        return updatedProfile;
      });

      return reply.status(200).send({ profile });
    } catch (err: any) {
      console.log(err);

      if (err.code === 404) {
        return reply.status(404).send();
      }
      return reply.badRequest('error in getting link');
    }
  };
