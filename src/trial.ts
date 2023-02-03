import { Milliseconds, RejectedTrial, ResolvedTrial, Trial } from './types';
import { PromiseTimeoutError } from './PromiseTimeoutError';
import { sleep } from './sleep';

/**
 * Extracts a Promise into a 2-length-tuple.<br>
 * If promise resolves, only first index is defined.<br>
 * If promise rejects, only second index is defined.<br>
 * -------------------------------------------------<br>
 * Can also specify an optional timeout in milliseconds to start a race between promise and timeout.<br>
 * If timeout is reached, an error is extracted.<br>
 * Otherwise, promise is trialled (resolved or rejected).
 * @param promise the promise to put to the trial.
 * @param timeout an optional timeout after which the trial will be rejected if promise is not resolved before.
 */
export const trial = <T>(promise: Promise<T>, timeout?: Milliseconds): Promise<Trial<T>> => {
  const ms = Number(timeout);

  if (ms > 0) {
    const [sleepPromise, clean, interrupt] = sleep(ms);

    promise.then(clean).catch(interrupt);
    const timeoutPromise = sleepPromise.then(() => Promise.reject(new PromiseTimeoutError(promise, ms)));

    return trial(Promise.race([promise, timeoutPromise]));
  }

  return promise
    .then((value) => [value, undefined] as ResolvedTrial<T>)
    .catch((reason) => [undefined, reason] as RejectedTrial);
};
