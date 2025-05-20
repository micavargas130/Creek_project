import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

process.env.NODE_ENV = 'test'; // Indica que estamos en pruebas

test('GET /bookings debe devolver estado 200', async () => {
  const response = await request(app).get('/bookings');
  assert.strictEqual(response.status, 200);
});
