import Queue from 'bull';
import { Readable } from 'stream';
import S3Client from './s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Blob } from 'node:buffer';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const byteSize = (str: string) => new Blob([str]).size;

const profilePageQueue = new Queue('profile-page', {
  redis: {
    host: '127.0.0.1',
    port: process.env.REDIS_PORT as unknown as number,
  },
});

async function processJSON(_data: Queue.Job) {
  const tmp = '<html><head><title>hi</title></head><body>Hello</body></html>';
  const filename = 'sites/profile-page3.html';
  const readable = Readable.from(tmp);

  const command = new PutObjectCommand({
    Key: filename,
    Body: readable,
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentLength: byteSize(tmp),
  });

  const res = await S3Client.send(command);

  return {
    id: _data.id,
    msg: 'done',
    res,
  };
}

profilePageQueue.process(function (job) {
  return processJSON(job.data);
});

async function updateProfilePage(data: any) {
  return await profilePageQueue.add(data);
}

export { profilePageQueue, updateProfilePage };
