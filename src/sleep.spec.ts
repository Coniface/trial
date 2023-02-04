import { sleep } from './sleep';
import { isPending } from './isPending';

jest.useFakeTimers();

describe('sleep', () => {

  it('should create a promise with a timeout', () => {
    const [promise, timeout] = sleep(5);
    expect(promise instanceof Promise).toBe(true);
    expect(timeout).toBeDefined();
  });

  it('should resolve after the specified timeout', async () => {
    const [promise] = sleep(5);
    expect(isPending(promise)).toBe(true);

    jest.advanceTimersByTime(4);
    expect(isPending(promise)).toBe(true);

    jest.advanceTimersByTime(1);
    expect(isPending(promise)).toBe(false);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should be cleanable and release resources early', async () => {
    const [promise, clean] = sleep(5);
    expect(isPending(promise)).toBe(true);

    clean();

    expect(isPending(promise)).toBe(false);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should be interruptible and release resources early', async () => {
    const [promise, , interrupt] = sleep(5);
    const randomError = new Error('Test error');
    expect(isPending(promise)).toBe(true);

    interrupt(randomError);

    expect(isPending(promise)).toBe(false);
    await expect(promise).rejects.toThrowError(randomError);
  });

});
