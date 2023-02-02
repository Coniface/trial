# Trial

_"I promise before Almighty God that the evidence which I shall give shall be the truth, the whole truth, and nothing
but the truth."_

A great tool to ensure your code keeps its promise!

## How to use it?

It could not be simpler than that!

- Reduces promise declaration indentation

```typescript
// Instead of
const promise = new Promise((resolve, reject) => {
  console.log(`Let's get to work!`);
});
```

```typescript
import { getTrial } from "@coniface/trial";

// Inline your promise
const [promise, resolve, reject] = getTrial<T>();
console.log(`Let's get to work!`);
```

- Encourages the use of strong typings instead of try/catch blocks

```typescript
// Instead of
async function somewhereInYourCode<T>(promise: Promise<T>) {
  try {
    const result = await promise;
    console.log(`Let's get to work!`)
  } catch (error) {
    console.error('An error occured', error)
  }
}
```

```typescript
import { trial } from "@coniface/trial";

// Use typings and inline your code
async function somewhereInYourCode<T>(promise: Promise<T>) {
  const [data, error] = await trial(promise);
  if (error) {
    // error exists in this context
    // data type is never
    console.error('An error occured', error);
    return;
  }
  // error does not exist in this context
  // data type is T
  console.log(`Let's get to work!`)
}
```

## Why this naming?

- `trial` is a concise 5-letter word to use as a function.
- The reference to the promise in tribunal.
- The result (guilty / not guilty) that matches with a promise state (resolved / rejected).
