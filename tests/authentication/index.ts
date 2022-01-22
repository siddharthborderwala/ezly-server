import { test } from 'tap';
import app from '../../src/app';

test('GET "/api/v1/auth"', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/auth',
  });

  t.equal(response.statusCode, 404, 'returns a status code of 404');
});

test('POST "/api/v1/auth/register" with bad payload', async (t) => {
  let response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  t.equal(response.statusCode, 400, 'returns a status code of 400');

  response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email: 'sid@example.com',
      password: 'test1234',
      passwordConfirmation: 'test123',
    },
  });

  t.equal(response.statusCode, 400, 'returns a status code of 400');
});

test('POST "/api/v1/auth/register" with ok payload', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email: 'johndoe@example.com',
      password: 'test1234',
      passwordConfirmation: 'test1234',
    },
  });

  t.equal(response.statusCode, 201, 'returns a status code of 201');
  const {
    user: { email },
    token,
  } = JSON.parse(response.body);
  t.equal(email, 'johndoe@example.com', 'got email');
  t.ok(token, 'got token');
});

test('POST "/api/v1/auth/login" with incorrect password', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'johndoe@example.com',
      password: 'test',
    },
  });

  t.equal(response.statusCode, 400, 'returns a status code of 400');
});

test('POST "/api/v1/auth/login" with incorrect email', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'johnd@example.com',
      password: 'test1234',
    },
  });

  t.equal(response.statusCode, 400, 'returns a status code of 400');
});

test('POST "/api/v1/auth/login" with ok payload', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'johndoe@example.com',
      password: 'test1234',
    },
  });

  t.equal(response.statusCode, 200, 'returns a status code of 200');
  const {
    user: { email },
    token,
  } = JSON.parse(response.body);
  t.equal(email, 'johndoe@example.com', 'got email');
  t.ok(token, 'got token');
});
