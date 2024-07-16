import { c, h, s, svgUse } from '../../dist/nnn.js'
import { bB, bK, bN, bP, bQ, bR, wB, wK, wN, wP, wQ, wR } from './alpha.js'

document.title = 'nnn • Chessboard Demo'

h(document.head,
  ['link', { rel: 'stylesheet', href: '/node_modules/@picocss/pico/css/pico.min.css' }])

let counter = -1

const cell = (/** @type {string?=} */ id) => {
  const config = {
    $style: {
      backgroundColor: (++counter + ((counter & 8) >> 3)) & 1 ? '#86a666' : '#ffffdd',
      left: `calc(${12.5 * (counter & 7) - 50}vmin + 50vw)`,
      top: `calc(${12.5 * (counter >> 3) - 50}vmin + 50vh)`
    }
  }

  return id != null ? svgUse(id, config) : s('svg', config)
}

h(document.body,
  ['style', c({
    div: { display: 'none' },
    svg: { height: '12.5vmin', width: '12.5vmin', position: 'absolute' }
  })],

  ['div', ...[bB, bK, bN, bP, bQ, bR, wB, wK, wN, wP, wQ, wR].map(hArgs => s(...hArgs))],

  ...'RNBQKBNRPPPPPPPP'.split('').map(piece => cell('b' + piece)),
  ...'x'.repeat(32).split('').map(() => cell()),
  ...'PPPPPPPPRNBQKBNR'.split('').map(piece => cell('w' + piece)))
