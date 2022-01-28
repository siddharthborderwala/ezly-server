import { FastifyInstance } from 'fastify';
import {
  trackingJS,
  trackingGIF,
  trackingTest,
} from '../controllers/analytics';

const AnalyticsRoute = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/js', trackingJS(fastify));
  fastify.get('/gif', trackingGIF(fastify));
  fastify.get('/test', trackingTest(fastify));
  // fastify.get('/track/:campaign/:list/:id', tracking(fastify));
};

export default AnalyticsRoute;
