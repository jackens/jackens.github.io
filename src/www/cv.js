import { h, jc, nanolightJs } from '../../dist/nnn.js'
import { nanoPicoTheme } from '../../data/common.js'

document.title = 'jacek-czekaj'

h(document.body,
  ['style', jc({
    body: {
      padding: '1cm'
    },
    pre: {
      margin: 0,
      overflow: 'visible',
      ' code': {
        fontFamily: '"Source Code Pro"',
        fontSize: '95%',
        padding: 0
      }
    },
    img: {
      borderRadius: '1mm',
      position: 'absolute',
      right: '1cm',
      top: '1cm',
      width: '5cm'
    },
    ...nanoPicoTheme
  })],
  ['img', { src: '../res/jackens.jpeg' }])

const res = await fetch('/data/cv.data.js')
const code = await res.text()

h(document.body,
  ['pre', { style: 'background-color:inherit' },
    ['code', {
      $innerHTML: h('div', ...nanolightJs(code)).innerHTML
        .replace(/'(http?s:\/\/.+?)'/g, '\'<a href="$1">$1</a>\'')
        .replace(/'(\w+.\w+@\w+\.\w+)'/g, '\'<a href="mailto:$1">$1</a>\'')
    }]])

h(document.body,
  ['style', jc({
    '@page': {
      margin: 0,
      size: `21cm ${document.body.offsetHeight - 400}px`
    }
  })])
