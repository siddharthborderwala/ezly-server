import { FastifyInstance } from 'fastify';
import { createLink, deleteLink, getOneLink } from '../controllers/links';

const LinksRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/:linkId', getOneLink(fastify));

  fastify.post(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    createLink(fastify)
  );

  fastify.delete(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    deleteLink(fastify)
  );
};

export default LinksRouter;
