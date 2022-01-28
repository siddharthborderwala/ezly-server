import {
  createCollection,
  deleteCollection,
} from './../controllers/collections';
import { FastifyInstance } from 'fastify';

const CollectionRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    createCollection(fastify)
  );

  fastify.post(
    '/delete',
    {
      preHandler: [fastify.verifyJWT],
    },
    deleteCollection(fastify)
  );
};
