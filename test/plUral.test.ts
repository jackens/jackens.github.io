import { expect, test } from 'bun:test'
import { plUral } from '../src/nnn/plUral.js'

test('plUral', () => {
  const auto = plUral.bind(null, 'auto', 'auta', 'aut')

  expect(auto(0)).toStrictEqual('aut')
  expect(auto(1)).toStrictEqual('auto')
  expect(auto(17)).toStrictEqual('aut')
  expect(auto(42)).toStrictEqual('auta')

  const car = plUral.bind(null, 'car', 'cars', 'cars')

  expect(car(0)).toStrictEqual('cars')
  expect(car(1)).toStrictEqual('car')
  expect(car(17)).toStrictEqual('cars')
  expect(car(42)).toStrictEqual('cars')
})
