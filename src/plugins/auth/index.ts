import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';

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

        let payload: { id: string };

        try {
          const res = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
          payload = {
            id: res.id as string,
          };
        } catch {
          return reply.unauthorized('malformed token');
        }

        if (!payload.id) {
          return reply.unauthorized('not authorized');
        }

        try {
          const user = await server.prisma.user.findUnique({
            where: {
              id: payload.id,
            },
          });

          if (!user) {
            return reply.notFound('user not found');
          }

          request.requestContext.set('user', { id: user.id });
        } catch (err) {
          reply.notFound('user not found');
        }
      }
    );
  }
);

export default authPlugin;
