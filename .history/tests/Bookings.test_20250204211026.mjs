import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';

test('Ejemplo de prueba', async () => {
  const response = await fetch('http://localhost:3000/bookings');
  assert.strictEqual(response.status, 200);
});