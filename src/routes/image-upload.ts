import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import S3Client from '../util/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ImageUploadRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>
) => {
  fastify.get('/:ext', async (request: FastifyRequest, reply: FastifyReply) => {
    let { ext = '' }: any = request.params;
    ext = ext.trim();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${nanoid()}.${ext}`,
    });

    try {
      const url = await getSignedUrl(S3Client, command, {
        expiresIn: 3600,
        signingRegion: 'ap-south-1',
      });

      reply.send(url);
    } catch (err) {
      reply.status(500).send('Error while generating uploading url');
    }
  });
};

export default ImageUploadRouter;
