import { TrialRejecter, TrialResolver, TrialTuple } from './types';

/**
 * Creates a promise and returns it with its resolver and rejecter.
 * @returns {[
 * promise: Promise<T>,
 * (resolve: (value: (PromiseLike<T> | T)) => void),
 * (reject: (reason?: any) => void)
 * ]}
 */
export const getTrial = <T>(): TrialTuple<T> => {
  let resolver: TrialResolver<T>;
  let rejecter: TrialRejecter;
  const promise = new Promise<T>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [promise, resolver!, rejecter!];
};
