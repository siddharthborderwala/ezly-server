import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fs from 'fs';

export const trackingTest =
  (fastify: FastifyInstance) =>
  (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/html');
    reply.send(fs.createReadStream(path.join(__dirname, 'test.html')));
  };
