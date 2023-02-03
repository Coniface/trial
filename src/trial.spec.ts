import { getTrial } from './getTrial';
import { trial } from './trial';
import { isPending } from './isPending';
import { PromiseTimeoutError } from './PromiseTimeoutError';

jest.useFakeTimers();

describe('trial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should get the value from a resolved promise', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 352;

    resolve(randomNumber);
    const [result, error] = await trial(promise);

    expect(result).toBe(randomNumber);
    expect(error).toBeUndefined();
  });

  it('should get the error from a rejected promise', async () => {
    const [promise, _, reject] = getTrial<number>();
    const randomError = new Error('Test error');

    reject(randomError);
    const [result, error] = await trial(promise);

    expect(result).toBeUndefined();
    expect(error).toBe(randomError);
  });

  it('should resolve if promise resolves before timeout', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 417;
    expect(isPending(promise)).toBe(true);

    const trialTuple = trial(promise, 5);
    jest.advanceTimersByTime(3);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    resolve(randomNumber);
    const [result, error] = await trialTuple;
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    expect(result).toBe(randomNumber);
    expect(error).toBeUndefined();
  });

  it('should reject if promise rejects before timeout', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const [promise, _, reject] = getTrial<number>();
    const randomError = new Error('Test error');
    expect(isPending(promise)).toBe(true);

    const trialTuple = trial(promise, 5);
    jest.advanceTimersByTime(3);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    reject(randomError);
    const [result, error] = await trialTuple;
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    expect(result).toBeUndefined();
    expect(error).toBe(randomError);
  });

  it('should reject if timeout is reached', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 201;
    expect(isPending(promise)).toBe(true);

    const trialTuple = trial(promise, 5);
    expect(jest.getTimerCount()).toBe(1);
    jest.advanceTimersToNextTimer();
    expect(jest.getTimerCount()).toBe(0);
    const [result, error] = await trialTuple;

    expect(result).toBeUndefined();
    expect(error instanceof PromiseTimeoutError).toBe(true);

    resolve(randomNumber);
    await expect(promise).resolves.toBe(randomNumber);
  });

});
