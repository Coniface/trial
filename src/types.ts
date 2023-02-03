// Alias
export type Milliseconds = number;

// getTrial types
type executor<T> = Parameters<ConstructorParameters<typeof Promise<T>>[0]>;
export type TrialResolver<T> = executor<T>[0];
export type TrialRejecter = executor<any>[1];
export type TrialTuple<T> = [promise: Promise<T>, resolve: TrialResolver<T>, reject: TrialRejecter];

// trial types
export type ResolvedTrial<T> = [value: T, reason: undefined];
export type RejectedTrial = [value: undefined, reason: Error];
export type Trial<T> = ResolvedTrial<T> | RejectedTrial;
