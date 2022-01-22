import jwt from 'jsonwebtoken';

export const createAndSignJWT = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};
