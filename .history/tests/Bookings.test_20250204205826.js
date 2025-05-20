import { test, strictEqual } from 'node:test';
import assert from 'node:assert';
import app from '../index.js';

test('Ejemplo de prueba', async () => {
  const response = await fetch('http://localhost:3000/tu-endpoint');
  strictEqual(response.status, 200);
});