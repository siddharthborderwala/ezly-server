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

        // const cookieResult = reply.unsignCookie(request.cookies.token);

        // if (!authorizationHeader && !cookieResult.valid) {
        //   return reply.badRequest('authentication token not found');
        // }

        if (!authorizationHeader) {
          return reply.badRequest('authentication token not found');
        }

        // cookie takes precedence
        // as on the frontend we set the http secure cookies
        const token = authorizationHeader?.replace('Bearer ', '' as string)!;
        // const token =
        //   cookieResult.value ??
        //   (authorizationHeader?.replace('Bearer ', '') as string);

        let payload: { id: string };

        try {
          const res = jwt.verify(
            token.trim(),
            process.env.JWT_SECRET!
          ) as JwtPayload;
          payload = {
            id: res.id as string,
          };
        } catch (error) {
          return reply.unauthorized('malformed token');
        }

        if (!payload.id) {
          return reply.unauthorized('not authorized');
        }

        request.requestContext.set('user', {
          id: payload.id,
        });
      }
    );
  }
);

export default authPlugin;
