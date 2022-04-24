import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { createAndSignJWT } from '../../util/jwt';
import { Body } from '../../util/render-html';

const generateDefaultBody = (username: string): Body => ({
  links: [],
  socials: [],
  meta: {
    background: 'hsla(0, 100%, 100%, 1)',
    font: 'Inter',
    username: username,
    image: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${username}`,
    description: '',
  },
});

type RegisterBodyType = {
  email: string;
  password: string;
  passwordConfirmation: string;
  username: string;
};

export const register =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, passwordConfirmation, username } =
      request.body as RegisterBodyType;

    if (!email) {
      return reply.badRequest('email required');
    }

    if (!password) {
      return reply.badRequest('password required');
    }

    if (!passwordConfirmation) {
      return reply.badRequest('passwordConfirmation required');
    }

    if (!username) {
      return reply.badRequest('username is required');
    }

    if (!validator.isEmail(email)) {
      return reply.badRequest('invalid email');
    }

    if (!validator.isAlphanumeric(username)) {
      return reply.badRequest(
        'only alphanumeric characters allowed in the username, no spaces'
      );
    }

    if (password !== passwordConfirmation) {
      return reply.badRequest('password and passwordConfirmation do not match');
    }

    if (password.trim().length < 6) {
      return reply.badRequest('password must be longer than 5 characters');
    }

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    try {
      const user = await fastify.prisma.$transaction(async (prisma) => {
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

        await prisma.profile.create({
          data: {
            username: username,
            body: generateDefaultBody(username),
          },
        });

        return user;
      });

      const token = createAndSignJWT({ id: user.id });

      return reply
        .status(201)
        .setCookie('token', token)
        .send({
          user: { email: user.email, id: user.id, username: user.username },
          token,
        });
    } catch (error) {
      // is it an error from prisma/db
      const errcode = (error as any).code;
      if (errcode) {
        switch (errcode) {
          case 'P2002': {
            return reply.badRequest(
              `account with ${(error as any).meta.target} already exists`
            );
          }
          default:
            return reply.badRequest();
        }
      } else {
        return reply.status(500).send({
          error: error,
        });
      }
    }
  };
