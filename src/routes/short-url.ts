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
            path: stats.path.at(0) ?? '',
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
    } else {
      console.log('link id not found');
    }
  });

  fastify.get('/:url', async (request, reply) => {
    const { url } = request.params as { url: string };
    let longerUrl = (await fastify.redis.get(url)) as string;

    if (!longerUrl) {
      return reply.status(404).send('not found :(');
    }

    reply
      .code(302)
      .redirect(`https://${longerUrl.replace(/^https?:\/\//, '')}`);
  });
};

export default ShortURLRouter;
