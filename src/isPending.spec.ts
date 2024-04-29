import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { getTrial } from './getTrial.js';
import { isPending } from './isPending.js';

describe('isPending', () => {
  it('should return whether a promise is pending or not if resolved', async () => {
    const [promise, resolve] = getTrial<void>();
    assert.equal(isPending(promise), true);

    resolve();

    assert.equal(isPending(promise), false);
    await assert.doesNotReject(promise);
    assert.equal(await promise, undefined);
  });

  it('should return whether a promise is pending or not if reject', async () => {
    const [promise, , reject] = getTrial<void>();
    assert.equal(isPending(promise), true);

    reject();

    assert.equal(isPending(promise), false);
    await assert.rejects(promise);
  });
});
