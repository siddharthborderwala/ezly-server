import { FastifyInstance } from 'fastify';
import { createStatistics } from '../util/createStatistics';

const ShortURLRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.addHook('onResponse', async (request, reply) => {
    const { url } = request.params as { url: string };

    const link = await fastify.prisma.link.findUnique({
      where: {
        short_url: url,
      },
    });

    if (link?.id) {
      try {
        const stats = await createStatistics(request);
        await fastify.prisma.analytics.create({
          data: {
            referer: stats.referer,
            path: stats.path.at(0) || '',
            ip: stats.ip,
            browser: stats.browser,
            browserLang: stats.browserLang,
            os: stats.os,
            osVer: stats.osVer,
            device: stats.device,
            deviceModel: stats.deviceModel,
            deviceType: stats.deviceType,
            countryCode: stats.countryCode,
            countryName: stats.countryName,
            link_id: link.id,
          },
        });
      } catch (error) {
        console.log('error while creating statistics', error);
      }
    }
  });

  fastify.get('/:url', async (request, reply) => {
    const { url } = request.params as { url: string };
    const longerUrl = await fastify.redis.get(url);

    if (!longerUrl) {
      return reply.status(404).send('not found :(');
    }

    // TODO Check for https in the beginning, else it will redirect to our own site
    reply.code(302).redirect(`https://${longerUrl}`);
  });
};

export default ShortURLRouter;
