import { link, nanoPicoTheme } from '../../data/common.js'
import { h, is, jc, nanolightJs, s, svgUse } from '../../dist/nnn.js'
// @ts-expect-error
import { marked } from '../../node_modules/marked/lib/marked.esm.js'

document.title = 'nnn • Documentation'

h(document.body,
  ['style', jc({
    body: {
      padding: '20px'
    },
    'h1,h2,h3,h4': {
      '>a': {
        marginLeft: '0.4em',
        '>svg': {
          width: '0.7em',
          height: '0.7em'
        }
      }
    },
    ...nanoPicoTheme
  })],
  ['div', { $style: { display: 'none' } }, s(...link)])

const /** @type {Partial<Array<string>>} */ names = []
const res = await fetch('/dist/readme.md')
const md = await res.text()
const div = h('div', {
  $innerHTML: marked(md.replace('- [Documentation](https://jackens.github.io/nnn/doc/)\n', ''))
})

// @ts-expect-error
Array.from(div.querySelectorAll('h1,h2,h3,h4')).forEach((
  /** @type {HTMLHeadingElement} */ e, i, /** @type {Partial<Array<HTMLHeadingElement>>} */ eArr
) => {
  const text = e.innerText
  const name = text === 'Usage Examples'
    ? text.replace(/\W+|$/g, '-') + eArr[i - 1]?.innerText
    : text

  if (e.tagName === 'H3') {
    names.push(name)
  }

  e.parentNode?.insertBefore(h('a', { id: name, name }), e)

  h(e, ['a', { href: '#' + name }, svgUse('link')])
})

const ARG_IS = JSON.stringify([['span', { class: 'literal' }, 'arg'], ' ', ['span', { class: 'keyword' }, 'is']])
const SLASH_S = JSON.stringify(['\\', ['span', { class: 'literal' }, 's']])

for (const e of div.querySelectorAll('code')) {
  if (['', 'language-js', 'language-ts'].includes(e.className)) {
    const code = e.innerText

    h(e, { $innerText: '' }, ...nanolightJs(code).map((e2, i, e2Arr) => {
      if (is(Array, e2) &&
          JSON.stringify(e2Arr.slice(i - 2, i + 1)) !== ARG_IS &&
          JSON.stringify(e2Arr.slice(i - 1, i + 1)) !== SLASH_S) {
        const name = e2[2]

        if (is(String, name) && names.includes(name)) {
          e2[2] = ['a', { href: '#' + name }, name]
        }
      }

      return e2
    }))
  }
}

h(document.body, ...div.children)

if (location.hash !== '') {
  // eslint-disable-next-line no-self-assign
  location = location
}
