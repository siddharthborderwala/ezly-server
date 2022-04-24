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

      if (!user) {
        return reply.unauthorized('no such user exists');
      }

      const isValidPassword = await bcrypt.compare(password, user?.password!);

      if (!isValidPassword) {
        return reply.unauthorized('please check the email and password');
      }

      const token = createAndSignJWT({ id: user.id });

      return reply
        .status(200)
        .setCookie('token', token)
        .send({
          user: { email: user.email, id: user.id, username: user.username },
          token,
        });
    } catch (error) {
      return reply.unauthorized('please check the email and password - server');
    }
  };
