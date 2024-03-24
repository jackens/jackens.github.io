import { expect, test } from 'bun:test'
import { uuid1 } from '../src/nnn/uuid1.js'

test('uuid1', () => {
  for (let i = 1; i <= 22136; ++i) {
    const uuid = uuid1()

    i === 1 && expect(uuid.split('-')[3]).toStrictEqual('8001')
    i === 4095 && expect(uuid.split('-')[3]).toStrictEqual('8fff')
    i === 4096 && expect(uuid.split('-')[3]).toStrictEqual('9000')
    i === 9029 && expect(uuid.split('-')[3]).toStrictEqual('a345')
    i === 13398 && expect(uuid.split('-')[3]).toStrictEqual('b456')
    i === 16384 && expect(uuid.split('-')[3]).toStrictEqual('8000')
    i === 17767 && expect(uuid.split('-')[3]).toStrictEqual('8567')
  }
})

test('uuid1: node', () => {
  expect(uuid1({ node: '000123456789abc' }).split('-')[4]).toStrictEqual('123456789abc')
  expect(uuid1({ node: '123456789' }).split('-')[4]).toStrictEqual('000123456789')
})

test('uuid1: date', () => {
  expect(uuid1({ date: new Date(323325000000) }).startsWith('c1399400-9a71-11bd')).toBeTrue()
})
