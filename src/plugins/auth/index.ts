import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface RequestContextData {
    user: {
      id: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = fp(
  async (server: FastifyInstance, options) => {
    server.decorate(
      'verifyJWT',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const authorizationHeader = request.headers.authorization;
        const tokenCookie = request.cookies.token;

        if (!authorizationHeader && !tokenCookie) {
          return reply.badRequest('authentication token not found');
        }

        // cookie takes precedence
        // as on the frontend we set the http secure cookies
        const token =
          tokenCookie ?? authorizationHeader?.replace('Bearer ', '');
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
        };
        if (!payload) {
          return reply.forbidden('not authorized');
        }

        const prisma: PrismaClient = server.prisma;
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: payload.id,
            },
          });
          request.requestContext.set('user', { id: payload.id });
        } catch (err) {
          reply.notFound('user not found');
        }
      }
    );
  }
);

export default authPlugin;
