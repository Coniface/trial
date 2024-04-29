import { getTrial } from './getTrial.js';
import type { Milliseconds } from './types.js';

/**
 * Returns a promise that resolves after the specified delay in milliseconds.<br>
 * Can also be resolved or rejected ahead of time with the two additional functions.
 */
export const sleep = (
  time: Milliseconds,
): [promise: Promise<void>, clean: () => void, interrupt: (reason?: unknown) => void] => {
  const [promise, resolve, reject] = getTrial<void>();
  const timeout = setTimeout(resolve, time);

  const cleaner = () => {
    clearTimeout(timeout);
    resolve();
  };
  const interrupter = (reason?: unknown) => {
    clearTimeout(timeout);
    reject(reason);
  };

  return [promise, cleaner, interrupter];
};
