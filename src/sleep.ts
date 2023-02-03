import { Milliseconds } from './types';
import { getTrial } from './getTrial';

/**
 * Returns a promise that resolves after the specified delay in milliseconds.<br>
 * Can also be resolved or rejected ahead of time with the two additional functions.
 */
export const sleep = (time: Milliseconds): [
  promise: Promise<void>,
  clean: () => void,
  interrupt: (reason?: any) => void,
] => {
  const [promise, resolve, reject] = getTrial<void>();
  const timeout = setTimeout(resolve, time);

  const cleaner = () => {
    clearTimeout(timeout);
    resolve();
  };
  const interrupter = (reason?: any) => {
    clearTimeout(timeout);
    reject(reason);
  };

  return [promise, cleaner, interrupter];
};
