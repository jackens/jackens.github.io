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
      ['Chess.com News', 'https://www.chess.com/news'],
      ['GitHub • jackens • Stars', 'https://github.com/jackens?tab=stars'],
      ['GitHub • Trending Go', 'https://github.com/trending/go'],
      ['GitHub • Trending JavaScript', 'https://github.com/trending/javascript'],
      ['GitHub • Trending Rust', 'https://github.com/trending/rust'],
      ['GitHub • Trending TypeScript', 'https://github.com/trending/typescript'],
      ['GitHub • Trending V', 'https://github.com/trending/v'],
      ['GitHub • Trending Zig', 'https://github.com/trending/zig'],
      ['GitHub • Trending', 'https://github.com/trending'],
      ['Jackens’ Homepage', 'https://jackens.github.io/'],
      ['Lichess', 'https://lichess.org/pl'],
      ['nnn • Documentation', 'https://jackens.github.io/nnn/doc/'],
      ['nnn • NPM', 'https://www.npmjs.com/package/@jackens/nnn'],
      ['PS Deals', 'https://psdeals.net/pl-store'],
      ['Running • geojson.io', 'https://geojson.io/'],
      ['Running • gpx.studio', 'https://gpx.studio/'],
      ['YouTube • Andrzej Dragan', 'https://www.youtube.com/results?search_query=andrzej+dragan']
    ].map(/** @returns {HArgs} */ ([text, href]) => ['li', ['a', { href }, text]])
  ])
