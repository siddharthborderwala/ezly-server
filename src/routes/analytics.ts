import { FastifyInstance } from 'fastify';
import { getStats } from '../controllers/analytics';

const AnalyticsRoute = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/:alias', getStats(fastify));
};

export default AnalyticsRoute;
