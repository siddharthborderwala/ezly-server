import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fs from 'fs';

type TrackingParamsType = {
  id: number;
};

export const trackingJS =
  (fastify: FastifyInstance) =>
  (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/javascript');
    reply.send(fs.createReadStream(path.join(__dirname, 'track.js')));
  };
