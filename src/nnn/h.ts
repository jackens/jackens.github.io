import { is } from './is.js'

/**
 * The type of arguments of the `h` and `s` helpers.
 */
// eslint-disable-next-line no-use-before-define
export type HArgs1 = Partial<Record<PropertyKey, any>> | null | undefined | Node | string | number | HArgs

/**
 * The type of arguments of the `h` and `s` helpers.
 */
export type HArgs = [string | Node, ...HArgs1[]]

const NS: Partial<Record<PropertyKey, string>> = {
  xlink: 'http://www.w3.org/1999/xlink'
}

const _h: {
  (namespaceURI?: null | undefined): {
    <T extends keyof HTMLElementTagNameMap>(tag: T, ...args1: Partial<Array<HArgs1>>): HTMLElementTagNameMap[T];
    <N extends Node> (node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
  };
  (namespaceURI: 'http://www.w3.org/2000/svg'): {
    <T extends keyof SVGElementTagNameMap> (tag: T, ...args1: Partial<Array<HArgs1>>): SVGElementTagNameMap[T];
    <N extends Node> (node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
  };
} = (namespaceURI?: 'http://www.w3.org/2000/svg' | null | undefined) => {
  const createElement = namespaceURI == null
    ? (tag: string) => document.createElement(tag)
    : (tag: string) => document.createElementNS(namespaceURI, tag)

  const h = (tagOrNode: string | Node, ...args: Partial<Array<HArgs1>>) => {
    const node = is(String, tagOrNode) ? createElement(tagOrNode) : tagOrNode

    args.forEach(arg => {
      let child: Node | null = null

      if (arg instanceof Node) {
        child = arg
      } else if (is(String, arg) || is(Number, arg)) {
        // @ts-expect-error
        child = document.createTextNode(arg)
      } else if (is(Array, arg)) {
        // @ts-expect-error
        child = h(...arg)
      } else if (arg != null) {
        for (const name in arg) {
          const value = arg[name]

          if (name[0] === '$') {
            const name1 = name.slice(1)

            if (is(Object, value)) {
              // @ts-expect-error
              node[name1] = node[name1] ?? {}
              // @ts-expect-error
              Object.assign(node[name1], value)
            } else {
              // @ts-expect-error
              node[name1] = value
            }
          } else if (node instanceof Element) {
            const indexOfColon = name.indexOf(':')

            if (indexOfColon >= 0) {
              const ns: string | undefined = NS[name.slice(0, indexOfColon)]

              if (ns != null) {
                const basename = name.slice(indexOfColon + 1)

                if (value === true) {
                  node.setAttributeNS(ns, basename, '')
                } else if (value === false) {
                  node.removeAttributeNS(ns, basename)
                } else {
                  node.setAttributeNS(ns, basename, is(String, value) ? value : '' + value)
                }
              }
            } else {
              if (value === true) {
                node.setAttribute(name, '')
              } else if (value === false) {
                node.removeAttribute(name)
              } else {
                node.setAttribute(name, is(String, value) ? value : '' + value)
              }
            }
          }
        }
      }

      if (child != null) {
        node.appendChild(child)
      }
    })

    return node
  }

  return h
}

/**
 * A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `HTMLElement`s (see also `s`).
 *
 * - The first argument of type `string` specifies the tag of the element to be created.
 * - The first argument of type `Node` specifies the element to be modified.
 * - All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
 *   Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
 *   (Note that `$` is not a valid attribute name character.)
 *   All other keys specify *attributes* to be set by `setAttribute`.
 *   An attribute equal to `false` causes the attribute to be removed by `removeAttribute`.
 * - All other arguments of type `null` or `undefined` are simply ignored.
 * - All other arguments of type `Node` are appended to the element being created or modified.
 * - All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
 * - All other arguments of type `HArgs` are passed to `h` and the results are appended to the element being created or modified.
 */
export const h = _h()

/**
 * A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `SVGElement`s (see also `h`).
 *
 * - The first argument of type `string` specifies the tag of the element to be created.
 * - The first argument of type `Node` specifies the element to be modified.
 * - All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
 *   Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
 *   (Note that `$` is not a valid attribute name character.)
 *   All other keys specify *attributes* to be set by `setAttributeNS`.
 *   An attribute equal to `false` causes the attribute to be removed by `removeAttributeNS`.
 * - All other arguments of type `null` or `undefined` are simply ignored.
 * - All other arguments of type `Node` are appended to the element being created or modified.
 * - All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
 * - All other arguments of type `HArgs` are passed to `s` and the results are appended to the element being created or modified.
 */
export const s = _h('http://www.w3.org/2000/svg')

/**
 * A convenient shortcut for `s('svg', ['use', { 'xlink:href': '#' + id }], ...args)`.
 */
export const svgUse = (id: string, ...args: Partial<Array<HArgs1>>) => s('svg', ['use', { 'xlink:href': '#' + id }], ...args)
