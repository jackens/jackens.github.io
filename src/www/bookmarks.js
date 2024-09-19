import { c, h } from '../../dist/nnn.js'

document.title = 'Bookmarks'

const a = /** @returns {import('../../dist/nnn.js').HArgs} */ (
  /** @type {string} */ text, /** @type {string} */ href
) => ['li', ['a', { href }, text]]

h(document.body,
  ['style', c({
    body: {
      padding: '20px'
    }
  })],
  ['ul',
    a('Pogoda • Katowice', 'https://weather.com/pl-PL/pogoda/godzinowa/l/f2b823199bed31459790ff62f9884bf7e2c6c688716027376a3dab1412c708f6')
  ],
  ['ul',
    a('Chess.com News', 'https://www.chess.com/news'),
    a('GitHub • Trending', 'https://github.com/trending'),
    a('GitHub • Trending Go', 'https://github.com/trending/go'),
    a('GitHub • Trending JavaScript', 'https://github.com/trending/javascript'),
    a('GitHub • Trending Rust', 'https://github.com/trending/rust'),
    a('GitHub • Trending TypeScript', 'https://github.com/trending/typescript'),
    a('GitHub • Trending Zig', 'https://github.com/trending/zig')
  ],
  ['ul',
    a('Strava', 'https://www.strava.com'),
    a('PS Deals', 'https://psdeals.net/pl-store'),
    a('Apple • Report a Problem', 'https://reportaproblem.apple.com/'),
    a('YouTube • Andrzej Dragan', 'https://m.youtube.com/results?search_query=andrzej+dragan')
  ],
  ['ul',
    a('Lichess', 'https://lichess.org/pl'),
    a('OpenFm 90s', 'https://www.radio.net/s/openfm90s'),
    a('BBC News', 'https://www.bbc.com/news/world/europe')
  ],
  ['ul',
    a('Jackens’ Homepage', 'https://jackens.github.io/'),
    a('GitHub • jackens', 'https://github.com/jackens/'),
    a('NPM • @jackens/nnn', 'https://www.npmjs.com/package/@jackens/nnn')
  ])
