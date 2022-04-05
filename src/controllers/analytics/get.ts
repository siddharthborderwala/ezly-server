import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type GetresParamsType = {
  alias: string;
};

export const getStats =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { alias } = request.params as GetresParamsType;
    try {
      const res = await fastify.prisma.link.findFirst({
        where: {
          short_url: alias,
        },
        include: {
          analytics: true,
          collection: true,
        },
      });
      if (!res) {
        reply.status(404).send('Data not found');
      }

      const stats = {
        url: res?.url,
        alias: res?.short_url,
        clicks: res?.analytics.length,
        collection: res?.collection.name,
        analytics: res?.analytics.map((item: any) => ({
          id: item.id,
          referer: item.referer,
          path: item.path,
          browser: item.browser,
          browserLang: item.browserLang,
          os: item.os,
          osVer: item.osVer,
          device: item.device,
          deviceModel: item.deviceModel,
          deviceType: item.deviceType,
          countryCode: item.countryCode,
          countryName: item.countryName,
        })),
      };

      return reply.status(200).send({
        stats,
      });
    } catch (err) {
      return reply.badRequest('error while retreiving res');
    }
  };
