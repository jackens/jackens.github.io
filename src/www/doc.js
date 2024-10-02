import { c, h, is, nanolightJs, s, svgUse } from '../../dist/nnn.js'
// @ts-expect-error
import { marked } from '../../node_modules/marked/lib/marked.esm.js'

document.title = 'nnn • Documentation'

const /** @type {Partial<Array<string>>} */ names = []
const res = await fetch('/dist/readme.md')
const md = await res.text()
const div = h('div', { $innerHTML: marked(md) })

// @ts-expect-error
Array.from(div.querySelectorAll('h1,h2,h3,h4')).forEach((
  /** @type {HTMLHeadingElement} */ e,
  i,
  /** @type {HTMLHeadingElement[]} */ eArr
) => {
  const text = e.innerText
  const name = text.replace(/\W+/g, '-').replace(/-+$/g, '') +
    (text === 'Usage Examples' ? '-' + eArr[i - 1]?.innerText : '')

  if (e.tagName === 'H3') {
    names.push(name)
  }

  e.parentNode?.insertBefore(h('a', { id: name, name }), e)

  h(e, ['a', { href: '#' + name }, svgUse('link')])
})

const CONST = JSON.stringify([['span', { class: 'keyword' }, 'const'], ' '])

for (const e of div.querySelectorAll('code')) {
  if (['', 'language-js', 'language-ts'].includes(e.className)) {
    h(e, { $innerText: '' }, ...nanolightJs(e.innerText).map((eI, i, eArr) => {
      if (is(Array, eI)) {
        const [, attributes, name] = eI

        if (is(String, name) && names.includes(name) && is(Object, attributes)) {
          const { class: cls } = attributes
          const next1 = JSON.stringify(eArr[i + 1])
          const prev2 = JSON.stringify(eArr.slice(i - 2, i))

          if (is(String, cls) && ['function', 'keyword', 'literal'].includes(cls) &&
            (name.length > 2 || next1 == null || next1.startsWith('"(') || prev2 === CONST)) {
            eI[2] = ['a', { href: '#' + name }, name]
          }
        }
      }

      return eI
    }))
  }
}

h(document.body,
  ['style', c({
    body: {
      padding: '20px'
    },
    'code>span.': {
      string: { color: 'var(--pico-ins-color)' },
      comment: { color: 'color-mix(in srgb,var(--pico-color),#000 40%)' },
      keyword: { color: 'var(--pico-del-color)' },
      operator: { color: 'color-mix(in srgb,var(--pico-del-color),#fff 20%)' },
      number: { color: 'color-mix(in srgb,var(--pico-ins-color),#fff 30%)' },
      function: { color: 'color-mix(in srgb,var(--pico-primary),#fff 30%)' },
      literal: { color: 'var(--pico-color)' }
    },
    '@media only screen and (prefers-color-scheme: light)': {
      'code>span.': {
        comment: { color: 'color-mix(in srgb,var(--pico-color),#fff 40%)' },
        operator: { color: 'color-mix(in srgb,var(--pico-del-color),#000 20%)' },
        number: { color: 'color-mix(in srgb,var(--pico-ins-color),#000 30%)' },
        function: { color: 'color-mix(in srgb,var(--pico-primary),#000 30%)' }
      }
    },
    'h1,h2,h3,h4': {
      '>a': {
        marginLeft: '0.4em',
        '>svg': {
          width: '0.7em',
          height: '0.7em'
        }
      }
    }
  })],
  ['div',
    { $style: { display: 'none' } },
    s('symbol',
      { viewBox: '0 0 5.292 5.292', id: 'link' },
      ['path', {
        d: 'M.38 3.03a1.328 1.328 0 0 0 .01 1.871 1.328 1.328 0 0 0 1.871.01l1.104-1.103a1.328 1.328 0 0 0-.218-2.04 29.37 29.37 0 0 0-.497.502l-.016.022c.079.031.154.08.22.145.25.25.25.63.01.87L1.76 4.41a.605.605 0 0 1-.868-.01.605.605 0 0 1-.01-.869l.453-.453a1.747 1.747 0 0 1-.142-.86Zm1.944-1.443-.133.138.174-.178zm-.214.222a.77.77 0 0 0-.17.307.909.909 0 0 1 .173-.31zm-.184-.324a1.328 1.328 0 0 0 .219 2.041 4.71 4.71 0 0 0 .487-.537.651.651 0 0 1-.194-.135.605.605 0 0 1-.011-.868L3.531.88c.24-.24.62-.239.869.01.25.25.25.629.01.87l-.448.448c.115.277.156.583.12.882l.83-.83a1.328 1.328 0 0 0-.01-1.87A1.328 1.328 0 0 0 3.03.38Zm1.37 1.803-.006.01c-.096.142-.2.272-.309.395l.008-.006.01-.009a.9.9 0 0 0 .298-.39'
      }])],
  ...div.children)

if (location.hash !== '') {
  // eslint-disable-next-line no-self-assign
  location = location
}
