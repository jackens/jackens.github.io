import { is } from './is.js'

/**
 * A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.
 */
export const has = (key: any, ref: any) =>
  (is(String, key) || is(Number, key) || is(Symbol, key)) && Object.hasOwnProperty.call(ref ?? Object, key)
