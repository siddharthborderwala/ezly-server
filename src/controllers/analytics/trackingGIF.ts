import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const BEACON = Buffer.from(
  'R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

type QueryType = {
  url?: string;
  t?: string;
  ref?: string;
};

export const trackingGIF =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { url, ref, t } = request.query as QueryType;
    if (url) {
      const data = {
        url: url,
        title: t || '',
        referer: ref || 'direct',
        referer2: request.headers.referer || 'direct',
        cookies: request.cookies || request.headers.cookies || {},
        path: request.headers.path || '',
        host: request.headers.host || '',
        ip: request.ip,
        parmas: request.params,
        platform: request.headers['sec-ch-ua-platform'],
      };

      console.log(data);

      reply.header('Content-Type', 'image/gif');
      reply.header('Cache-Control', 'private, no-cache');
      reply.status(200).send(BEACON);
    } else {
      reply.badRequest();
    }
  };
