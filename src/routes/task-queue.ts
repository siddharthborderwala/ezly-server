import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { updateProfilePage } from '../util/queue';

const TaskQueueRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    await updateProfilePage(request.body);
    reply.send('we got your updates, we will update it shortly');
  });
};

export default TaskQueueRouter;
