import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { getTrial } from './getTrial.js';

describe('getTrial', () => {
  it('should create a promise', () => {
    const [promise] = getTrial<void>();

    assert.equal(promise instanceof Promise, true);
  });

  it('should create a resolver', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 555;

    resolve(randomNumber);

    assert.equal(typeof resolve, 'function');
    await assert.doesNotReject(() => promise);
    assert.equal(await promise, randomNumber);
  });

  it('should create a rejecter', async () => {
    const [promise, , reject] = getTrial<number>();
    const error = new Error('Test error');

    reject(error);

    assert.equal(typeof reject, 'function');
    await assert.rejects(() => promise, error);
  });
});
