import { c, h } from '../../dist/nnn.js'

/** @import { HArgs } from '../../dist/nnn.js' */

document.title = 'Bookmarks'

h(document.body,
  ['style', c({
    body: {
      padding: '20px'
    },
    ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [
      `@media(min-width:${250 * ++i}px)`, {
        body: {
          columns: i
        }
      }]))
  })],
  ['ul',
    ...[
      ['Apple • Report a Problem', 'https://reportaproblem.apple.com/'],
      ['BBC News', 'https://www.bbc.com/news/world/europe'],
      ['Chess.com News', 'https://www.chess.com/news'],
      ['GitHub • Trending Go', 'https://github.com/trending/go'],
      ['GitHub • Trending JavaScript', 'https://github.com/trending/javascript'],
      ['GitHub • Trending Rust', 'https://github.com/trending/rust'],
      ['GitHub • Trending TypeScript', 'https://github.com/trending/typescript'],
      ['GitHub • Trending Zig', 'https://github.com/trending/zig'],
      ['GitHub • Trending', 'https://github.com/trending'],
      ['GitHub • jackens', 'https://github.com/jackens/'],
      ['Jackens’ Homepage', 'https://jackens.github.io/'],
      ['Lichess', 'https://lichess.org/pl'],
      ['NPM • @jackens/nnn', 'https://www.npmjs.com/package/@jackens/nnn'],
      ['OpenFm 90s', 'https://www.radio.net/s/openfm90s'],
      ['PS Deals', 'https://psdeals.net/pl-store'],
      ['Pogoda • Katowice', 'https://weather.com/pl-PL/pogoda/godzinowa/l/f2b823199bed31459790ff62f9884bf7e2c6c688716027376a3dab1412c708f6'],
      ['Strava', 'https://www.strava.com'],
      ['YouTube • Andrzej Dragan', 'https://www.youtube.com/results?search_query=andrzej+dragan'],
      ['YouTube • Sean Carrol', 'https://www.youtube.com/@seancarroll/playlists']
    ].map(/** @returns {HArgs} */ ([text, href]) => ['li', ['a', { href }, text]])
  ])
