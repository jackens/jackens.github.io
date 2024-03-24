import { is } from './is.js'

/**
 * The type of arguments of the `jc` helper.
 */
export type JcNode = {
    [attributeOrSelector: string]: string | number | JcNode | undefined
}

/**
 * The type of arguments of the `jc` helper.
 */
export type JcRoot = Partial<Record<PropertyKey, JcNode>>

const _jc = (node: JcNode, prefix: string, result: Partial<Array<string>>, split: (text: string) => string) => {
  const queue: Partial<Array<[JcNode | Partial<Array<string>>, string]>> = [[node, prefix]]

  while (queue.length > 0) {
    const [style0, prefix0] = queue.shift() ?? []

    if (style0 == null || prefix0 == null) {
      continue
    }

    if (is(Array, style0)) {
      result.push(prefix0, prefix0 !== '' ? '{' : '', style0.join(';'), prefix0 !== '' ? '}' : '')
    } else {
      const todo: [JcNode | Partial<Array<string>>, string][] = []
      let attributes: Partial<Array<string>> = []
      let attributesPushed = false

      for (const key in style0) {
        const value: string | number | JcNode | undefined = style0[key]

        if (is(String, value) || is(Number, value)) {
          if (!attributesPushed) {
            attributesPushed = true
            attributes = []
            todo.push([attributes, prefix0])
          }

          attributes.push(`${split(key).replace(/([A-Z])/g, (_, letter) => '-' + letter.toLowerCase())}:${value}`)
        } else if (value != null) {
          attributesPushed = false

          const prefixN: Partial<Array<string>> = []
          const keyChunks = key.split(',')

          prefix0.split(',').forEach(prefixChunk => keyChunks.forEach(keyChunk => prefixN.push(prefixChunk + keyChunk)))

          todo.push([value, prefixN.join(',')])
        }
      }

      queue.unshift(...todo)
    }
  }
}

/**
 * A simple JS-to-CSS (aka CSS-in-JS) helper.
 *
 * The `root` parameter provides a hierarchical description of CSS rules.
 *
 * - Keys of sub-objects whose values are NOT objects are treated as CSS attribute, and values are treated as values of those CSS attributes; the concatenation of keys of all parent objects is a CSS rule.
 * - All keys ignore the part starting with a splitter (default: `$$`) sign until the end of the key (e.g. `src$$1` → `src`, `@font-face$$1` → `@font-face`).
 * - In keys specifying CSS attribute, all uppercase letters are replaced by lowercase letters with an additional `-` character preceding them (e.g. `fontFamily` → `font-family`).
 * - Commas in keys that makes a CSS rule cause it to “split” and create separate rules for each part (e.g. `{div:{margin:1,'.a,.b,.c':{margin:2}}}` → `div{margin:1}div.a,div.b,div.c{margin:2}`).
 * - Top-level keys that begin with `@` are not concatenated with sub-object keys.
 */
export const jc = (root: JcRoot, splitter = '$$') => {
  const split = (text: string) => text.split(splitter)[0]
  const chunks: Partial<Array<string>> = []

  for (const key in root) {
    const value = root[key]

    if (value != null) {
      if (key[0] === '@') {
        chunks.push(split(key) + '{')
        _jc(value, '', chunks, split)
        chunks.push('}')
      } else {
        _jc(value, split(key), chunks, split)
      }
    }
  }

  return chunks.join('')
}
