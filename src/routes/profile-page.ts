import { FastifyInstance } from 'fastify';
import S3Client from '../util/s3-client';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const ProfilePageRouter = async (
  fastify: FastifyInstance,
  _: Record<any, any>
) => {
  fastify.addHook('onResponse', async (request, reply) => {
    // console.log('request from onResponse hook of profile page', request.params);
    // update db here
  });

  fastify.get('/:username', async (request, reply) => {
    const { username } = request.params as { username: string };

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `sites/${username}-profile-page.html`,
    });

    try {
      const response = await S3Client.send(command);

      if (!response.Body) {
        return reply.status(404).send('profile not found');
      }

      reply
        .headers({
          'Content-Type': 'text/html; charset=UTF-8',
        })
        .send(response.Body);
    } catch (err) {
      return reply.status(404).send('page does not exist');
    }
  });
};

export default ProfilePageRouter;
