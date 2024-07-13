import { h, jc } from '../../dist/nnn.js'

document.title = 'Jackens’ Homepage'

h(document.head,
  ['link', { rel: 'stylesheet', href: '../../node_modules/@picocss/pico/css/pico.min.css' }])

const item = /** @returns {import('../../dist/nnn.js').HArgs} */ (
  /** @type {string}   */ href,
  /** @type {string}   */ text,
  /** @type {string[]} */ ...imgs
) => ['li',
  ['a', { href }, text],
  imgs.length > 0
    ? ['div', ...imgs.map(/** @returns {import('../../dist/nnn.js').HArgs} */ img => ['img', { src: `./res/${img}` }])]
    : null]

const res = (
  /** @type {string}   */ text,
  /** @type {string[]} */ ...imgs
) => item(`./res/${text}`, text, ...imgs)

h(document.body,
  ['style', jc({
    body: {
      padding: '20px'
    },
    img: {
      margin: '5px 20px 15px 0'
    }
  })],
  ['h1', 'Jackens’ Homepage'],
  location.port === '54321'
    ? ['ul', item('./bookmarks/', 'Bookmarks'), item('./_cv/', 'Curriculum Vitae')]
    : null,
  ['h2', 'nnn'],
  ['ul',
    item('./nnn/doc/', 'Documentation'),
    item('./nnn/test/', 'Tests'),
    item('./nnn/chessboard/', 'Chessboard Demo'),
    item('./nnn/gantt/', 'Gantt Chart Demo'),
    item('./nnn/rwd/', 'Responsive Web Design Demo')],
  ['h2', 'PDF'],
  ['ul',
    res('Comparison-of-the-Exact-and-Approximate-Algorithms-in-the-Random-Shortest-Path-Problem.pdf'),
    res('Grid-Typesetting-with-Inserts-Omission.pdf'),
    res('Pots-tex-and-Other-Useful-Plain-TeX-Packages-slides.pdf'),
    res('Pots-tex-and-Other-Useful-Plain-TeX-Packages.pdf'),
    res('Powlekanie-szkieletu.pdf'),
    res('Raporty-TeX-owe.pdf'),
    res('Reports-Using-TeX.pdf'),
    res('Rodziny-rownowazne-z-bazodanowa-rodzina-relacji.pdf')],
  ['h2', 'ZIP'],
  ['ul',
    res('FROGYS.zip', 'frogys.png'),
    res('GOMOKU.zip', 'gomoku.png', 'gomoku-sexy.png'),
    res('PONG3D.zip', 'pong3d.png'),
    res('PTAKI.zip', 'ptaki.png'),
    res('Proover-dla-systemu-DEP.zip', 'proover-dla-systemu-dep.png'),
    res('plan.zip', 'plan-lekcji.png'),
    res('pots.zip',
      'uwolnic-orke.png', 'paulek.png',
      'jojo.png', 'poirot.png',
      'logic.png', 'logic-ii.png',
      'logic-iii.png', 'demo.png',
      'zabki.png', 'zabki-ii.png',
      'logo.png', 'logo-2.png',
      'sprite-show.png', 'fonts-converter.png'),
    res('skinning.zip', 'skinning.png')]
)
