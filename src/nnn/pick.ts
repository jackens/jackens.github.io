/**
 * A helper that implements TypeScript’s `Pick` utility type.
 */
export const pick = <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>): Pick<T, K[number]> =>
  // @ts-expect-error
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))

/**
 * A helper that implements TypeScript’s `Omit` utility type.
 */
export const omit = <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>): Omit<T, K[number]> =>
  // @ts-expect-error
  Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))
