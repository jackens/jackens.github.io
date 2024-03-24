import { expect, test } from 'bun:test'
import { omit, pick } from '../src/nnn/pick.js'

test('pick', () => {
  const obj = { a: 42, b: '42', c: 17 }

  expect(pick(obj, ['a', 'b'])).toStrictEqual({ a: 42, b: '42' })
})

test('omit', () => {
  const obj = { a: 42, b: '42', c: 17 }

  expect(omit(obj, ['c'])).toStrictEqual({ a: 42, b: '42' })
})
