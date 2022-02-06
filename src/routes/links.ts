import { FastifyInstance } from 'fastify';
import {
  createLink,
  deleteLink,
  updateLink,
  getOneLink,
} from '../controllers/links';

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

  fastify.put(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    updateLink(fastify)
  );
};

export default LinksRouter;
