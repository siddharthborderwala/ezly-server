import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { updateProfilePage } from '../util/queue';

const TaskQueueRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    // task queue code here
    const data = await updateProfilePage(request.body);
    reply.send({
      data,
    });
  });
};

export default TaskQueueRouter;
