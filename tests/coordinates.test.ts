import test from 'node:test';
import assert from 'node:assert/strict';
import { coordinates } from '../src/coordinates.ts';

test('accepts the native geocoder numeric coordinates', () => {
  assert.deepEqual(coordinates(60.2, 24.9), { latitude: 60.2, longitude: 24.9 });
});
test('converts API strings into numbers', () => {
  assert.deepEqual(coordinates(' 60.2 ', '24.9'), { latitude: 60.2, longitude: 24.9 });
});
test('allows zero and negative coordinates', () => {
  assert.deepEqual(coordinates(0, -180), { latitude: 0, longitude: -180 });
});
test('rejects absent, nonnumeric, infinite and out-of-range coordinates', () => {
  for (const pair of [[null, 20], ['', 20], ['north', 20], [91, 20], [20, 181], [Infinity, 0]]) {
    assert.throws(() => coordinates(pair[0], pair[1]));
  }
});
