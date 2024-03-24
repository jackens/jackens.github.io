/**
 * A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty object.
 */

// @ts-expect-error
export const pro = (ref: any) => new Proxy(ref, {
  get (target, key) {
    return pro(target[key] = target[key] ?? {})
  }
})
