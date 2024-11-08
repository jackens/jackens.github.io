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
      ['GitHub • jackens', 'https://github.com/jackens/'],
      ['GitHub • Trending Go', 'https://github.com/trending/go'],
      ['GitHub • Trending JavaScript', 'https://github.com/trending/javascript'],
      ['GitHub • Trending Rust', 'https://github.com/trending/rust'],
      ['GitHub • Trending TypeScript', 'https://github.com/trending/typescript'],
      ['GitHub • Trending Zig', 'https://github.com/trending/zig'],
      ['GitHub • Trending', 'https://github.com/trending'],
      ['Jackens’ Homepage', 'https://jackens.github.io/'],
      ['Lichess', 'https://lichess.org/pl'],
      ['nnn • Documentation', 'https://jackens.github.io/nnn/doc/'],
      ['nnn • NPM', 'https://www.npmjs.com/package/@jackens/nnn'],
      ['OpenFm 90s', 'https://www.radio.net/s/openfm90s'],
      ['Pogoda • Katowice', 'https://weather.com/pl-PL/pogoda/godzinowa/l/f2b823199bed31459790ff62f9884bf7e2c6c688716027376a3dab1412c708f6'],
      ['PS Deals', 'https://psdeals.net/pl-store'],
      ['Running • Fueling Calculator', 'https://nduranz.com/pages/fueling-calculator'],
      ['Running • geojson.io', 'https://geojson.io/#map=11.05/50.2279/19.007'],
      ['Running • gpx.studio', 'https://gpx.studio/'],
      ['YouTube • Andrzej Dragan', 'https://www.youtube.com/results?search_query=andrzej+dragan'],
      ['YouTube • Sean Carrol', 'https://www.youtube.com/@seancarroll/playlists']
    ].map(/** @returns {HArgs} */ ([text, href]) => ['li', ['a', { href }, text]])
  ])
