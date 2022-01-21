import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FastifyInstance } from 'fastify';

type RegisterBodyType = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

type LoginBodyType = {
  email: string;
  password: string;
};

const createAndSignJWT = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

const AuthenticationRouter = async (
  fastify: FastifyInstance,
  options: Record<any, any>,
  done: any
) => {
  fastify.post('/register', async (request, reply) => {
    const { email, password, passwordConfirmation } =
      request.body as RegisterBodyType;

    if (!validator.isEmail(email)) {
      reply.badRequest('invalid email');
    }

    if (password !== passwordConfirmation) {
      reply.badRequest('password and passwordConfirmation do not match');
    }

    if (password.trim().length < 6) {
      reply.badRequest('password must be longer than 5 characters');
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
            reply.badRequest('account with email id already exists');
            break;
          default:
            break;
        }
      } else {
        return reply.status(500).send({
          error: error,
        });
      }
    }
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as LoginBodyType;

    if (!validator.isEmail(email)) {
      reply.badRequest('invalid email');
    }

    try {
      const user = await fastify.prisma.user.findUnique({
        where: { email },
      });

      const isValidPassword = await bcrypt.compare(password, user?.password!);

      if (!isValidPassword) {
        reply.forbidden('please check the email and password');
      }

      const token = createAndSignJWT({ id: user!.id });

      reply.status(200).send({
        user: { email },
        token,
      });
    } catch (error) {
      reply.forbidden('please check the email and password - server');
    }
  });

  done();
};

export default AuthenticationRouter;
