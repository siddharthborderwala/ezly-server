import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { Tedis } from 'tedis';

const prisma = new PrismaClient();

const redis = new Tedis({
  host: '127.0.0.1',
  port: process.env.REDIS_PORT as unknown as number,
});

async function createUser(email: string, password: string, username: string) {
  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

  const user = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
      },
    });

    await prisma.collection.create({
      data: {
        name: 'general',
        user_id: user.id,
      },
    });

    await prisma.collection.create({
      data: {
        name: 'profile-page',
        user_id: user.id,
      },
    });

    return user;
  });

  return user;
}

async function clearDB() {
  await redis.command('FLUSHALL');
  await prisma.analytics.deleteMany({});
  await prisma.link.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createCollection(name: string, user_id: string) {
  const collection = await prisma.collection.create({
    data: {
      name: name,
      user_id: user_id,
    },
  });

  return collection;
}

async function createLink(url: string, collection_id: string, user_id: string) {
  const short_url = nanoid(10);

  await redis.set(short_url, url);

  const link = await prisma.link.create({
    data: {
      url: url,
      collection_id: collection_id,
      user_id: user_id,
      short_url,
    },
  });

  return link;
}
async function createAnalytics(
  referer: string,
  path: string,
  ip: string,
  browser: string,
  browserLang: string,
  os: string,
  osVer: string,
  device: string,
  deviceModel: string,
  deviceType: string,
  countryCode: string,
  countryName: string,
  linkId: string
) {
  const analytics = await prisma.analytics.create({
    data: {
      referer: referer,
      path: path,
      ip: ip,
      browser: browser,
      browserLang: browserLang,
      os: os,
      osVer: osVer,
      device: device,
      deviceModel: deviceModel,
      deviceType: deviceType,
      countryCode: countryCode,
      countryName: countryName,
      link_id: linkId,
    },
  });

  return analytics;
}

async function main() {
  await clearDB();
  const user = await createUser('user@test.com', '123456', 'randomname');
  const collection = await createCollection('instagram', user.id);
  const link = await createLink('www.instagram.com', collection.id, user.id);
  const analytics = await createAnalytics(
    'direct',
    '',
    '142.250.192.142',
    'Edge',
    'en-US',
    'Windows',
    '10',
    '',
    '',
    'desktop',
    'USA',
    'United States',
    link.id
  );
  const analytics1 = await createAnalytics(
    'direct',
    '',
    '142.250.125.111',
    'Firefox',
    'en-US',
    'Windows',
    '10',
    '',
    '',
    'mobile',
    'IND',
    'India',
    link.id
  );

  redis.close();
}

main();
