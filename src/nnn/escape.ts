/**
 * The type of arguments of the `escapeValues` and `escape` helpers.
 */
export type EscapeMap = Map<any, (value?: any) => string>

/**
 * A generic helper for escaping `values` by given `escapeMap`.
 */
export const escapeValues = (escapeMap: EscapeMap, values: Partial<Array<any>>): Partial<Array<string>> =>
  values.map(value => (escapeMap.get(value?.constructor) ?? escapeMap.get(undefined))?.(value) ?? '')

/**
 * A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).
 */
export const escape = (escapeMap: EscapeMap, template: TemplateStringsArray, ...values: Partial<Array<any>>) =>
  String.raw(template, ...escapeValues(escapeMap, values))
