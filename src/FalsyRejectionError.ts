/**
 * An error that occurs when a trial rejects with a falsy value.
 * This error wraps the reason to avoid missuses where a `if (error)` would be falsy.
 */
export class FalsyRejectionError extends Error {
  constructor(public readonly reason: unknown) {
    super(`Cannot reject from a trial with falsy reason (rejected ${reason})`);
  }
}
