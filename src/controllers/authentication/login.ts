import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { createAndSignJWT } from '../../util/jwt';

type LoginBodyType = {
  email: string;
  password: string;
};

export const login =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
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

      return reply.status(200).setCookie('token', token).send({
        user: { email },
        token,
      });
    } catch (error) {
      return reply.forbidden('please check the email and password - server');
    }
  };
