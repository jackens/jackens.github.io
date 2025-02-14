import { c, h } from '../../dist/nnn.js'

/** @import { CNode, CRoot, HArgs } from '../../dist/nnn.js' */

document.title = 'nnn • Responsive Web Design Demo'

const CELL_WIDTH = 250
const CELL_HEIGHT = 100

const /** @type {CRoot} */ root = {
  body: {
    backgroundColor: '#222',
    margin: '5px'
  },
  '.c1,.c2,.c3,.c4,.c5,.c6,.c7,.c8': {
    borderRadius: '9px',
    border: 'solid #222 3px',
    color: '#222'
  },
  '.c1': {
    backgroundColor: '#e22'
  },
  '.c2': {
    backgroundColor: '#e73'
  },
  '.c3': {
    backgroundColor: '#fc3'
  },
  '.c4': {
    backgroundColor: '#ad4'
  },
  '.c5': {
    backgroundColor: '#4d9'
  },
  '.c6': {
    backgroundColor: '#3be'
  },
  '.c7': {
    backgroundColor: '#45d'
  },
  '.c8': {
    backgroundColor: '#c3e'
  }
}

for (let maxWidth = 1; maxWidth <= 10; ++maxWidth) {
  let /** @type {CNode} */ node

  if (maxWidth > 1) {
    root[`@media(min-width:${CELL_WIDTH * maxWidth}px)`] = { '.rwd': (node = {}) }
  } else {
    root['.rwd'] = node = {
      boxSizing: 'border-box',
      display: 'block',
      float: 'left',
      fontFamily: 'Arial,Helvetica,sans-serif',
      fontSize: `${CELL_HEIGHT / 2}px`,
      height: `${CELL_HEIGHT}px`,
      lineHeight: `${CELL_HEIGHT}px`,
      textAlign: 'center',
      width: '100%'
    }
  }

  node[`.w-${maxWidth}-0`] = { display: 'none' }

  for (let width = 1; width <= maxWidth; ++width) {
    let gcd = 100 * width
    let tmp = maxWidth

    while (tmp) {
      [gcd, tmp] = [tmp, gcd % tmp]
    }

    const w100PerGcd = 100 * width / gcd

    node[`.w-${maxWidth}-${width}`] = {
      display: 'block',
      width: maxWidth === gcd ? `${w100PerGcd}%` : `calc(${w100PerGcd}% / ${maxWidth / gcd})`
    }
  }

  for (let height = 1; height <= 5; ++height) {
    node[`.h-${maxWidth}-${height}`] = {
      fontSize: `${CELL_HEIGHT * height / 2}px`,
      height: `${CELL_HEIGHT * height}px`,
      lineHeight: `${CELL_HEIGHT * height}px`
    }
  }
}

let counter = 0

const div = /** @return {HArgs} */ (
  /** @type {string}                */ spec,
  /** @type {Partial<Array<HArgs>>} */ ...items
) => ['div', { class: `rwd ${spec}` }, ...(items.length > 0 ? items : [++counter])]

h(document.body,
  ['style', c(root)],

  div('c1 w-2-1 h-2-2 h-1-1'),
  div('w-2-1 h-1-2', div('c1'), div('c1')),

  div('c2 w-6-1 w-3-1 w-2-1'),
  div('c2 w-6-1 w-3-1 w-2-1'),
  div('c2 w-6-1 w-3-1 w-2-1'),
  div('c2 w-6-1 w-3-1 w-2-1'),
  div('c2 w-6-1 w-3-1 w-2-1'),
  div('c2 w-6-1 w-3-1 w-2-1'),

  div('c3 w-4-2 w-2-2'),
  div('c3 w-4-1 w-2-1'),
  div('c3 w-4-1 w-2-1'),

  div('c4 w-10-2 w-5-2 w-2-2'),
  div('c4 w-10-1 w-5-1 w-2-1'),
  div('c4 w-10-1 w-5-1 w-2-1'),
  div('c4 w-10-1 w-5-1 w-2-1'),
  div('c4 w-10-3 w-5-3 w-2-1'),
  div('c4 w-10-1 w-5-1 w-2-1'),
  div('c4 w-10-1 w-5-1 w-2-1'),

  div('w-4-2 h-4-1 w-2-1 h-2-2 h-1-2', div('c5 w-4-2 w-2-2'), div('c5 w-4-2 w-2-2')),
  div('w-4-2 h-4-1 w-2-1 h-2-2 h-1-2', div('c5 w-4-2 w-2-2'), div('c5 w-4-2 w-2-2')),

  div('c6 w-4-1 w-2-1'),
  div('c6 w-4-1 w-2-1'),
  div('c6 w-4-1 w-2-1'),
  div('c6 w-4-1 w-2-1'),

  div('c7 w-2-1 w-1-0'),
  div('c7 w-2-1 h-2-1 w-1-1 h-1-2'),

  div('c8 w-3-1 w-2-1 h-3-1 h-2-1 h-1-3'),
  div('c8 w-3-1 w-2-1 h-3-1 h-2-1 h-1-3'),
  div('c8 w-3-1 h-3-1 h-2-2 h-1-3')
)
