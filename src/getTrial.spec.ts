import { getTrial } from './getTrial';

describe('getTrial', () => {

  it('should create a promise', () => {
    const [promise] = getTrial<void>();

    expect(promise instanceof Promise).toBe(true);
  });

  it('should create a resolver', async () => {
    const [promise, resolve] = getTrial<number>();
    const randomNumber = 555;

    resolve(randomNumber);

    expect(typeof resolve).toBe('function');
    await expect(promise).resolves.toBe(randomNumber);
  });

  it('should create a rejecter', async () => {
    const [promise, , reject] = getTrial<number>();
    const error = new Error('Test error');

    reject(error);

    expect(typeof reject).toBe('function');
    await expect(promise).rejects.toThrowError(error);
  });

});
