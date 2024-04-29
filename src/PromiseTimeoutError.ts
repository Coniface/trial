import type { Milliseconds } from './types.ts';

/**
 * An error that occurs when a trial times out.
 */
export class PromiseTimeoutError<T> extends Error {
  constructor(
    public readonly promise: Promise<T>,
    public readonly timeout: Milliseconds,
  ) {
    super(`Promise timeout ${timeout}ms`);
  }
}
