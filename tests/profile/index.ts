import * as test from 'tap';
import app from '../../src/app';

let jwt = '';

test.before(async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'johndoe',
      passwordConfirmation: 'johndoe',
    },
  });
  jwt = JSON.parse(res.body).token;
});

test.teardown(async () => {
  await app.prisma.user.delete({
    where: {
      username: 'johndoe',
    },
  });
});

test.test('POST "/api/v1/profile/:username" - create profile', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/profile/johndoe',
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });

  t.not(JSON.parse(response.body).profile, undefined);
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test.test('GET "/api/v1/profile/:username" - get profile', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/profile/johndoe',
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });

  t.not(JSON.parse(response.body).profile, undefined);
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test.test('PATCH "/api/v1/profile/:username" - update profile', async (t) => {
  const response = await app.inject({
    method: 'PATCH',
    url: '/api/v1/profile/johndoe',
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    payload: {},
  });

  t.not(JSON.parse(response.body).profile, undefined);
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test.test(
  'POST "/api/v1/profile/:username/publish" - publish profile',
  async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/profile/johndoe/publish',
      headers: {
        authorization: `Bearer ${jwt}`,
      },
      payload: {},
    });

    t.not(JSON.parse(response.body).version, undefined);
    t.equal(response.statusCode, 200, 'returns a status code of 200');
  }
);
