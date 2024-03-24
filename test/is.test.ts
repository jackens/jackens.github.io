import { expect, test } from 'bun:test'
import { is } from '../src/nnn/is.js'

test('is', () => {
  expect(is(Number, 42)).toBeTrue()
  expect(is(Number, Number(42))).toBeTrue()
  // eslint-disable-next-line no-new-wrappers
  expect(is(Number, new Number(42))).toBeTrue()
  expect(is(Number, NaN)).toBeTrue()
  expect(is(String, '42')).toBeTrue()
  expect(is(String, String('42'))).toBeTrue()
  // eslint-disable-next-line no-new-wrappers
  expect(is(String, new String('42'))).toBeTrue()
  expect(is(Symbol, Symbol('42'))).toBeTrue()
  expect(is(Symbol, Object(Symbol('42')))).toBeTrue()
  expect(is(undefined, undefined)).toBeTrue()
  expect(is(undefined, null)).toBeTrue()
  expect(is(Object, {})).toBeTrue()
  expect(is(Array, [])).toBeTrue()
  expect(is(RegExp, /42/)).toBeTrue()
  expect(is(Date, new Date(42))).toBeTrue()
  expect(is(Set, new Set(['42', 42]))).toBeTrue()
  expect(is(Map, new Map([[{ j: 42 }, { J: '42' }], [{ c: 42 }, { C: '42' }]]))).toBeTrue()
})

test('is: toString.call', () => {
  const iz = (type: any, arg: any) => ({}).toString.call(arg).slice(8, -1) === type?.name

  class FooBar { }

  expect(is(FooBar, new FooBar())).toBeTrue()
  expect(iz(FooBar, new FooBar())).toBeFalse()

  expect(is(Object, new FooBar())).toBeFalse()
  expect(iz(Object, new FooBar())).toBeTrue()

  const fakeFooBar = {}

  // @ts-expect-error
  fakeFooBar[Symbol.toStringTag] = FooBar.name

  expect(is(FooBar, fakeFooBar)).toBeFalse()
  expect(iz(FooBar, fakeFooBar)).toBeTrue()

  expect(is(Object, fakeFooBar)).toBeTrue()
  expect(iz(Object, fakeFooBar)).toBeFalse()
})

test('is: try to override constructor', () => {
  const num = 42
  const str = '42'

  expect(is(Number, num)).toBeTrue()

  try {
    num.constructor = str.constructor
  } catch { /* empty */ }

  expect(is(Number, num)).toBeTrue()
})
