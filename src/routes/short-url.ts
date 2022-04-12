import { FastifyInstance } from 'fastify';

const ShortURLRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.addHook('onResponse', async (request, reply) => {
    // console.log('request from onResponse hook of short url', request.params);
    // update db here
  });

  fastify.get('/:url', async (request, reply) => {
    const { url } = request.params as { url: string };
    const longerUrl = await fastify.redis.get(url);

    console.log(' from redis', longerUrl);

    if (!longerUrl) {
      return reply.status(404).send('not found :(');
    }

    // TODO Check for https in the beginning, else it will redirect to our own site
    reply.code(302).redirect(`https://${longerUrl}`);
  });
};

export default ShortURLRouter;
