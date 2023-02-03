import { getTrial } from './getTrial';
import { isPending } from './isPending';

describe('isPending', () => {

  it('should return whether a promise is pending or not if resolved', async () => {
    const [promise, resolve] = getTrial<void>();
    expect(isPending(promise)).toBe(true);

    resolve();

    expect(isPending(promise)).toBe(false);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should return whether a promise is pending or not if reject', async () => {
    const [promise, _, reject] = getTrial<void>();
    expect(isPending(promise)).toBe(true);

    reject();

    expect(isPending(promise)).toBe(false);
    await expect(promise).rejects.toBeUndefined();
  });

});
