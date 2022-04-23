import { FastifyInstance } from 'fastify';
import { getStats, overview } from '../controllers/analytics';

const AnalyticsRoute = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get(
    '/:alias',
    {
      preHandler: [fastify.verifyJWT],
    },
    getStats(fastify)
  );

  fastify.get(
    '/profile/overview',
    {
      preHandler: [fastify.verifyJWT],
    },
    overview(fastify)
  );
};

export default AnalyticsRoute;
