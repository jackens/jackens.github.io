import { expect, test } from 'bun:test'
import { nanolightJs } from '../src/nnn/nanolightJs.js'

test('nanolightJs', () => {
  const codeJs = 'const answerToLifeTheUniverseAndEverything = 42'

  expect(nanolightJs(codeJs)).toStrictEqual([
    ['span', { class: 'keyword' }, 'const'],
    ' ',
    ['span', { class: 'literal' }, 'answerToLifeTheUniverseAndEverything'],
    ' ',
    ['span', { class: 'operator' }, '='],
    ' ',
    ['span', { class: 'number' }, '42']
  ])
})
