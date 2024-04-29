import * as assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { sleep } from './sleep.js';
import { isPending } from './isPending.js';

mock.timers.enable({ apis: ['setTimeout'] });

describe('sleep', () => {
  it('should create a promise with a timeout', () => {
    const [promise, timeout] = sleep(5);
    assert.equal(promise instanceof Promise, true);
    assert.notEqual(timeout, undefined);
  });

  it('should resolve after the specified timeout', async () => {
    const [promise] = sleep(5);
    assert.equal(isPending(promise), true);

    mock.timers.tick(4);
    assert.equal(isPending(promise), true);

    mock.timers.tick(1);
    assert.equal(isPending(promise), false);
    await assert.doesNotReject(promise);
    assert.equal(await promise, undefined);
  });

  it('should be cleanable and release resources early', async () => {
    const [promise, clean] = sleep(5);
    assert.equal(isPending(promise), true);

    clean();

    assert.equal(isPending(promise), false);
    await assert.doesNotReject(promise);
    assert.equal(await promise, undefined);
  });

  it('should be interruptible and release resources early', async () => {
    const [promise, , interrupt] = sleep(5);
    const randomError = new Error('Test error');
    assert.equal(isPending(promise), true);

    interrupt(randomError);

    assert.equal(isPending(promise), false);
    await assert.rejects(promise, randomError);
  });
});
