import * as assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { getTrial } from './getTrial.js';
import { isPending } from './isPending.js';
import { PromiseTimeoutError } from './PromiseTimeoutError.js';
import { trial } from './trial.js';

describe('trial', () => {
  beforeEach(() => {
    mock.reset();
    mock.timers.reset();
    mock.timers.enable({ apis: ['setTimeout'] });
  });

  it('should get the value from a resolved promise', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 352;

    resolve(randomNumber);
    const [result, error] = await trial(promise);

    assert.equal(result, randomNumber);
    assert.equal(error, undefined);
  });

  it('should get the error from a rejected promise', async () => {
    const [promise, , reject] = getTrial<number>();
    const randomError = new Error('Test error');

    reject(randomError);
    const [result, error] = await trial(promise);

    assert.equal(result, undefined);
    assert.equal(error, randomError);
  });

  it('should resolve if promise resolves before timeout', async () => {
    const clearTimeoutSpy = mock.method(global, 'clearTimeout');

    const [promise, resolve] = getTrial<number>();
    const randomNumber = 417;
    assert.equal(isPending(promise), true);

    const trialTuple = trial(promise, 5);
    mock.timers.tick(3);
    assert.equal(clearTimeoutSpy.mock.callCount(), 0);
    resolve(randomNumber);
    const [result, error] = await trialTuple;
    assert.equal(clearTimeoutSpy.mock.callCount(), 1);

    assert.equal(result, randomNumber);
    assert.equal(error, undefined);
  });

  it('should reject if promise rejects before timeout', async () => {
    const clearTimeoutSpy = mock.method(global, 'clearTimeout');
    const [promise, , reject] = getTrial<number>();
    const randomError = new Error('Test error');
    assert.equal(isPending(promise), true);

    const trialTuple = trial(promise, 5);
    mock.timers.tick(3);
    assert.equal(clearTimeoutSpy.mock.callCount(), 0);
    reject(randomError);
    const [result, error] = await trialTuple;
    assert.equal(clearTimeoutSpy.mock.callCount(), 1);

    assert.equal(result, undefined);
    assert.equal(error, randomError);
  });

  it('should reject if timeout is reached', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 201;
    assert.equal(isPending(promise), true);

    const trialTuple = trial(promise, 5);
    mock.timers.runAll();
    const [result, error] = await trialTuple;

    assert.equal(result, undefined);
    assert.equal(error instanceof PromiseTimeoutError, true);

    resolve(randomNumber);
    await assert.doesNotReject(promise);
    assert.equal(await promise, randomNumber);
  });
});
