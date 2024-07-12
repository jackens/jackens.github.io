import { h, jc } from '../../dist/nnn.js'

document.title = 'Bookmarks'

h(document.head,
  ['link', { rel: 'stylesheet', href: '../../node_modules/@picocss/pico/css/pico.min.css' }])

const res = await fetch('../res/bookmarks.md')
const bookmarksMd = await res.text()
const /** @type {Partial<Array<import('../nnn/h.js').HArgs>>} */ items =
  bookmarksMd.trim().split('\n').map(line => {
    const [, title, href] = line.match(/^- \[(.*?)\]\((.*)\)$/) ?? []
    return ['li', ['a', { href, target: '_blank' }, title]]
  })

h(document.body,
  ['style', jc({
    body: {
      padding: '20px'
    }
  })],
  ['ul', ...items])
