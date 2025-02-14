import { c, h } from '../../dist/nnn.js'

/** @import { HArgs} from '../../dist/nnn.js' */

document.title = 'Jackens’ Homepage'

const item = /** @returns {HArgs} */ (
  /** @type {string}   */ href,
  /** @type {string}   */ text,
  /** @type {string[]} */ ...imgs
) => ['li',
  ['a', { href }, text],
  imgs.length > 0
    ? ['div', ...imgs.map(/** @returns {HArgs} */ img => ['img', { src: `./res/${img}` }])]
    : null]

const res = (
  /** @type {string}   */ text,
  /** @type {string[]} */ ...imgs
) => item(`./res/${text}`, text, ...imgs)

h(document.body,
  ['style', c({
    body: {
      padding: '20px'
    },
    img: {
      margin: '5px 20px 15px 0'
    }
  })],
  ['h1', 'Jackens’ Homepage'],
  ['h2', 'nnn'],
  ['ul',
    item('/nnn/doc/', 'Documentation'),
    item('/nnn/test/', 'Tests'),
    item('/nnn/chessboard/', 'Chessboard Demo'),
    item('/nnn/rwd/', 'Responsive Web Design Demo'),
    item('/nnn/gantt/', 'Gantt Chart Demo')],
  ['h2', 'Archive PDFs'],
  ['ul',
    res('Comparison-of-the-Exact-and-Approximate-Algorithms-in-the-Random-Shortest-Path-Problem.pdf'),
    res('Grid-Typesetting-with-Inserts-Omission.pdf'),
    res('Raporty-TeX-owe.pdf'),
    res('Reports-Using-TeX.pdf'),
    res('Pots-tex-and-Other-Useful-Plain-TeX-Packages-slides.pdf'),
    res('Pots-tex-and-Other-Useful-Plain-TeX-Packages.pdf'),
    res('Rodziny-rownowazne-z-bazodanowa-rodzina-relacji.pdf'),
    res('Powlekanie-szkieletu.pdf')],
  ['h2', 'Archive ZIPs'],
  ['ul',
    res('Proover-dla-systemu-DEP.zip', 'proover-dla-systemu-dep.png'),
    res('skinning.zip', 'skinning.png'),
    res('plan.zip', 'plan-lekcji.png'),
    res('PONG3D.zip', 'pong3d.png'),
    res('FROGYS.zip', 'frogys.png'),
    res('GOMOKU.zip', 'gomoku.png', 'gomoku-sexy.png'),
    res('PTAKI.zip', 'ptaki.png'),
    res('pots.zip',
      'paulek.png',
      'uwolnic-orke.png',
      'demo.png',
      'logo-2.png', 'logo.png',
      'zabki-ii.png', 'zabki.png',
      'logic-iii.png', 'logic-ii.png', 'logic.png',
      'poirot.png',
      'jojo.png')]
)
