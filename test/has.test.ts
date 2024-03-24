import { expect, test } from 'bun:test'
import { has } from '../src/nnn/has.js'

test('has', () => {
  const obj = { key: 'K', null: 'N' }

  expect('key' in obj).toBeTrue()
  expect(has('key', obj)).toBeTrue()

  expect('null' in obj).toBeTrue()
  expect(has('null', obj)).toBeTrue()

  // @ts-expect-error
  expect(null in obj).toBeTrue()
  expect(has(null, obj)).toBeFalse()

  expect('toString' in obj).toBeTrue()
  expect(has('toString', obj)).toBeFalse()
})

test('has: null', () => {
  let typeError

  try {
    // @ts-expect-error
    'key' in null
  } catch (error) {
    typeError = error
  }

  expect(typeError instanceof TypeError) // Cannot use 'in' operator to search for 'key' in null
  expect(has('key', null)).toBeFalse()
})
