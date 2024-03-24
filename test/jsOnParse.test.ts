import { expect, test } from 'bun:test'
import { jsOnParse } from '../src/nnn/jsOnParse.js'

test('jsOnParse', () => {
  const handlers = {
    $hello: (name: string) => `Hello ${name}!`,
    $foo: () => 'bar'
  }

  const actual = jsOnParse(handlers, `[
    {
      "$hello": ["World"]
    },
    {
      "nested": {
        "$hello": ["nested World"]
      },
      "one": 1,
      "two": 2
    },
    {
      "$foo": []
    },
    {
      "$foo": ["The parent object does not have exactly one property!"],
      "one": 1,
      "two": 2
    }
  ]`)

  const expected = [
    'Hello World!',
    {
      nested: 'Hello nested World!',
      one: 1,
      two: 2
    },
    'bar',
    {
      $foo: ['The parent object does not have exactly one property!'],
      one: 1,
      two: 2
    }
  ]

  expect(actual).toStrictEqual(expected)
})
