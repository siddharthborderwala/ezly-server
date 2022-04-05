import { FastifyInstance } from 'fastify';
import { getStats } from '../controllers/analytics';

const AnalyticsRoute = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/:linkId', getStats(fastify));
};

export default AnalyticsRoute;
