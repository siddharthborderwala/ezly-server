import Queue from 'bull';
import { Readable } from 'stream';
import S3Client from './s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Blob } from 'node:buffer';
import renderHTML, { Body } from 'ezly-render-html';

const byteSize = (str: string) => new Blob([str]).size;

const profilePageQueue = new Queue('profile-page', {
  redis: {
    host: '127.0.0.1',
    port: process.env.REDIS_PORT as unknown as number,
  },
});

async function processJSON(data: Queue.Job<Body>) {
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
}

profilePageQueue.process(function (job) {
  return processJSON(job.data);
});

async function updateProfilePage(data: Body) {
  return await profilePageQueue.add(data);
}

export { profilePageQueue, updateProfilePage };
