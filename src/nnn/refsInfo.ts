import { is } from './is.js'

/**
 * A helper that provides information about the given `refs`.
 *
 * It returns an array of triples: `[«name», «prototype-name», «array-of-own-property-names»]`.
 */
export const refsInfo = (...refs: Partial<Array<any>>) => {
  const fns = new Set<Function>()

  refs.forEach(ref => {
    while (is(Function, ref) && !fns.has(ref) && `${ref}`.includes('[native code]')) {
      fns.add(ref)
      ref = Object.getPrototypeOf(ref)
    }
  })

  return Array.from(fns.values()).map((fn): [string, string, Partial<Array<string>>] => [
    fn.name,
    Object.getPrototypeOf(fn)?.name ?? '',
    Object.getOwnPropertyNames(fn.prototype ?? Object.create(null)).sort()
  ]).sort((a, b) => -(a[0] < b[0]))
}
