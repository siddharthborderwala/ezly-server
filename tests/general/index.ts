import { test } from 'tap';
import app from '../../src/app';

test('requests the "/" route', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('requests the "/ping" route', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/ping',
  });

  t.equal(response.statusCode, 200, 'returns a status code of 200');
  t.equal(response.body, 'pong', 'returns "pong"');
});
