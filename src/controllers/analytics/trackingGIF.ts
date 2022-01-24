import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const BEACON = Buffer.from(
  'R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

type QueryType = {
  url?: string;
};

export const trackingGIF =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { url } = request.query as QueryType;

    if (url) {
      reply.header('Content-Type', 'image/gif');
      reply.header('Cache-Control', 'private, no-cache');
      reply.status(200).send(BEACON);
    } else {
      reply.badRequest();
    }
  };
