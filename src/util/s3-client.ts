import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_CLIENT_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
  },
  region: 'ap-south-1',
});

export default client;
