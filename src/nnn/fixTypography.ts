import { h } from './h.js'

const TAGS_TO_SKIP = ['IFRAME', 'NOSCRIPT', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA']

/**
 * A helper that implements typographic corrections specific to Polish typography.
 */
export const fixTypography = (node: Node) => {
  const queue: Partial<Array<Node>> = [node]

  while (queue.length > 0) {
    const node0 = queue.shift()

    if (node0 instanceof Element) {
      node0.childNodes.forEach(childNode => {
        if (childNode instanceof Text) {
          queue.push(childNode)
        } else if (childNode instanceof Element && !TAGS_TO_SKIP.includes(childNode.tagName)) {
          queue.push(childNode)
        }
      })
    } else if (node0 instanceof Text) {
      const nodeValue = node0.nodeValue?.trim?.()

      if (nodeValue != null) {
        let previousNode: Node = node0

        nodeValue.split(/(\s|\(|„)([aiouwz—]\s)/gi).forEach((chunk, i) => {
          i %= 3

          const currentNode = i === 2
            ? h('span', { style: 'white-space:nowrap' }, chunk)
            : i === 1
              ? document.createTextNode(chunk)
              : document.createTextNode(chunk.replace(/(\/(?=[^/\s])|\.(?=[^\s]))/g, '$1\u200B'))

          if (node0.parentNode != null) {
            node0.parentNode.insertBefore(currentNode, previousNode.nextSibling)
          }

          previousNode = currentNode
        })

        node0.parentNode?.removeChild(node0)
      }
    }
  }
}
