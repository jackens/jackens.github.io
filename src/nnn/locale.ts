import { is } from './is.js'

/**
 * Language translations helper.
 */
export const locale = (map: Partial<Record<PropertyKey, Partial<Record<PropertyKey, string>>>>, defaultVersion: string) =>
  (text: string, version: string = defaultVersion) => {
    const textV = map?.[version]?.[text]
    const textD = map?.[defaultVersion]?.[text]

    return is(String, textV) ? textV : is(String, textD) ? textD : text
  }
