import { FastifyInstance } from 'fastify';
import { createLink } from '../controllers/links';

const LinksRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    createLink(fastify)
  );
};

export default LinksRouter;
