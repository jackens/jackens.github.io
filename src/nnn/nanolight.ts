import { HArgs1 } from './h.js'

/**
 * A generic helper for syntax highlighting (see also `nanolightJs`).
 */
export const nanolight = (
  pattern: RegExp,
  highlighters: ((chunk: string, index: number) => HArgs1)[],
  code: string
) => {
  const result: Partial<Array<HArgs1>> = []

  code.split(pattern).forEach((chunk, index) => {
    if (chunk != null && chunk !== '') {
      index %= highlighters.length
      result.push(highlighters[index](chunk, index))
    }
  })

  return result
}
