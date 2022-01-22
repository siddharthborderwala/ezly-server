import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { createAndSignJWT } from '../../util/jwt';

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
      const user = await fastify.prisma.user.create({
        data: {
          email: email,
          password: passwordHash,
        },
      });

      const token = createAndSignJWT({ id: user.id });

      return reply.status(201).send({
        user: { email },
        token,
      });
    } catch (error) {
      // is it an error from prisma/db
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
