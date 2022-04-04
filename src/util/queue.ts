import Queue from 'bull';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const profilePageQueue = new Queue('profile-page', {
  redis: {
    host: '127.0.0.1',
    port: process.env.REDIS_PORT as unknown as number,
  },
});

async function processJSON(_data: Queue.Job) {
  // construct HTML file

  // upload file to s3

  // maybe update on db ?
  await sleep(20000);
  return {
    id: _data.id,
    msg: 'done',
  };
}

profilePageQueue.process(function (job) {
  return processJSON(job.data);
});

async function updateProfilePage(data: any) {
  return await profilePageQueue.add(data);
}

export { profilePageQueue, updateProfilePage };
