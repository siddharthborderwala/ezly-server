import { createOneProfile } from './../controllers/profile/create-one';
import { FastifyInstance } from 'fastify';
import {
  getOneProfile,
  patchOneProfile,
  publishOneProfile,
} from './../controllers/profile';

const ProfileRouter = async (fastify: FastifyInstance, _: Record<any, any>) => {
  fastify.get(
    '/:username',
    {
      preHandler: [fastify.verifyJWT],
    },
    getOneProfile(fastify)
  );

  fastify.post(
    '/:username',
    {
      preHandler: [fastify.verifyJWT],
    },
    createOneProfile(fastify)
  );

  fastify.patch(
    '/:username',
    {
      preHandler: [fastify.verifyJWT],
    },
    patchOneProfile(fastify)
  );

  fastify.post(
    '/:username/publish',
    {
      preHandler: [fastify.verifyJWT],
    },
    publishOneProfile(fastify)
  );
};

export default ProfileRouter;
