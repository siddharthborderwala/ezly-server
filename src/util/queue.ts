import Queue from 'bull';
import { Readable } from 'stream';
import S3Client from './s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Blob } from 'node:buffer';
import renderHTML, { Body } from './render-html';

const byteSize = (str: string) => new Blob([str]).size;

const profilePageQueue = new Queue('profile-page', {
  redis: {
    host: '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT!),
  },
});

profilePageQueue.process(async (data: Queue.Job<Body>) => {
  const page = renderHTML(data.data);

  const command = new PutObjectCommand({
    Key: `sites/${data.data.meta.username}-profile-page.html`,
    Body: Readable.from(page),
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentLength: byteSize(page),
  });

  const res = await S3Client.send(command);

  return {
    id: data.id,
    msg: 'done',
    res,
  };
});

async function updateProfilePage(data: Body) {
  await profilePageQueue.add(data);
}

export { profilePageQueue, updateProfilePage };
