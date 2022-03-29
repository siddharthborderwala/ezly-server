import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

async function main() {
  await clearDB();
  const user = await createUser('user@test.com', '123456');
}

main();
