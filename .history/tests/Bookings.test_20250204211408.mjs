import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

test('GET /bookings debe devolver estado 200', async () => {
  const response = await request(app).get('/bookings');
  assert.strictEqual(response.status, 200);
});