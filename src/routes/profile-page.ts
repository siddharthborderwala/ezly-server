import { FastifyInstance } from 'fastify';
import S3Client from '../util/s3-client';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';

const ProfilePageRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.addHook('onResponse', async (request, reply) => {
    // console.log('request from onResponse hook of profile page', request.params);
    // update db here
  });

  fastify.get('/:username', async (request, reply) => {
    console.log(request.params);

    console.log('hi from profile page route');

    const { username } = request.params as { username: string };

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `sites/${username}-profile-page.html`,
    });

    try {
      const response = await S3Client.send(command);

      if (!response.Body) {
        return reply.status(404).send('username does not exist');
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
