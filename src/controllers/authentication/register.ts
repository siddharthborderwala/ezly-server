import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { createAndSignJWT } from '../../util/jwt';
import { prisma, PrismaClient } from '@prisma/client';

type RegisterBodyType = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export const register =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, passwordConfirmation } =
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

    if (!validator.isEmail(email)) {
      return reply.badRequest('invalid email');
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

      const token = createAndSignJWT({ id: user.id });

      return reply.status(201).setCookie('token', token).send({
        user: { email },
        token,
      });
    } catch (error) {
      // is it an error from prisma/db
      console.log(error);
      const errcode = (error as any).code;
      if (errcode) {
        switch (errcode) {
          case 'P2002':
            return reply.badRequest('account with email id already exists');
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
