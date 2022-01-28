import {
  createCollection,
  deleteCollection,
  getCollections,
  getOneCollection,
  updateCollection,
} from './../controllers/collections';
import { FastifyInstance } from 'fastify';

const CollectionRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/:collectionId', getOneCollection(fastify));
  fastify.get(
    '/all',
    {
      preHandler: [fastify.verifyJWT],
    },
    getCollections(fastify)
  );

  fastify.post(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    createCollection(fastify)
  );

  fastify.delete(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    deleteCollection(fastify)
  );

  fastify.put(
    '/',
    {
      preHandler: [fastify.verifyJWT],
    },
    updateCollection(fastify)
  );
};

export default CollectionRouter;
