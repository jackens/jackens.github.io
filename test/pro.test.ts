import { expect, test } from 'bun:test'
import { pro } from '../src/nnn/pro.js'

test('pro', () => {
  const ref = {}

  pro(ref).one.two[3][4] = 1234

  expect(ref).toStrictEqual({ one: { two: { 3: { 4: 1234 } } } })

  pro(ref).one.two.tree = 123

  expect(ref).toStrictEqual({ one: { two: { 3: { 4: 1234 }, tree: 123 } } })

  pro(ref).one.two = undefined

  expect(ref).toStrictEqual({ one: { two: undefined } })

  delete pro(ref).one.two

  expect(ref).toStrictEqual({ one: {} })

  pro(ref).one.two.three.four

  expect(ref).toStrictEqual({ one: { two: { three: { four: {} } } } })

  pro(ref).one.two.three.four = 1234

  expect(ref).toStrictEqual({ one: { two: { three: { four: 1234 } } } })
})
