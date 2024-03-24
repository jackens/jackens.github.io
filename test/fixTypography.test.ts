import { expect, test } from 'bun:test'
import { fixTypography } from '../src/nnn/fixTypography.js'
import { h } from '../src/nnn/h.js'

test('fixTypography', () => {
  const p = h('p', 'Pchnąć w tę łódź jeża lub ośm skrzyń fig (zob. https://pl.wikipedia.org/wiki/Pangram).')

  fixTypography(p)

  expect(p.innerHTML).toStrictEqual(
    'Pchnąć <span style="white-space:nowrap">w </span>tę łódź jeża lub ośm skrzyń fig ' +
    '(zob. https://\u200Bpl.\u200Bwikipedia.\u200Borg/\u200Bwiki/\u200BPangram).')
})
