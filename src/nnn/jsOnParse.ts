import { is } from './is.js'

/**
 * `JSON.parse` with “JavaScript turned on”.
 *
 * Objects having *exactly* one property which is present in the `handlers` map, i.e. objects of the form:
 *
 * ```js
 * { "«handlerName»": [«params»] }
 * ```
 *
 * are replaced by the result of call
 *
 * ```js
 * handlers['«handlerName»'](...«params»)
 * ```
 */
export const jsOnParse = (handlers: Partial<Record<PropertyKey, Function>>, text: string) =>
  JSON.parse(text, (key, value) => {
    if (is(Object, value)) {
      let isSecondKey = false

      for (key in value) {
        if (isSecondKey) {
          return value
        }
        isSecondKey = true
      }

      const handler = handlers[key]
      const params = value[key]

      if (is(Function, handler) && is(Array, params)) {
        return handler(...params)
      }
    }

    return value
  })
