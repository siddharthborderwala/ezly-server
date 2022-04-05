import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

  const user = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
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
  const link = await prisma.link.create({
    data: {
      url: url,
      collection_id: collection_id,
      user_id: user_id,
      // TODO create alias with link helper
      short_url: nanoid(10),
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
  const user = await createUser('user@test.com', '123456');
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
    'US',
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
    'IN',
    'India',
    link.id
  );
}

main();
