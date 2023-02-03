import { inspect } from 'util';

/**
 * Returns a boolean whether a promise is pending or not.<br>
 * Useful for unit testing.
 * @external inspect
 */
export const isPending = <T>(promise: Promise<T>): boolean => {
    return inspect(promise).includes('pending');
}
