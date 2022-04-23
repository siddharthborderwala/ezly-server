import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Body as ProfileBody } from 'ezly-render-html';
import { updateProfilePage } from '../../util/queue';

export const publishOneProfile =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.params as { username: string };

    try {
      let version = await fastify.prisma.$transaction(async (prisma) => {
        const profile = await prisma.profile.findUnique({
          where: { username },
        });

        if (!profile) {
          throw 404;
        }

        await updateProfilePage(profile.body as ProfileBody);

        const { publishedVersion } = await prisma.profile.update({
          where: { username },
          data: {
            publishedVersion: profile.savedVersion,
          },
        });

        return publishedVersion;
      });

      return reply.status(200).send({ version });
    } catch (err) {
      if (err === 404) {
        return reply.status(404).send();
      }
      return reply.badRequest('error in getting link');
    }
  };
