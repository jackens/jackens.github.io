import { expect, test } from 'bun:test'
import { h } from '../src/nnn/h.js'

test('h', () => {
  const b = h('b')

  expect(b.outerHTML).toStrictEqual('<b></b>')

  const i = h('i', 'text')

  h(b, i)

  expect(i.outerHTML).toStrictEqual('<i>text</i>')
  expect(b.outerHTML).toStrictEqual('<b><i>text</i></b>')

  h(i, { $className: 'some class' })

  expect(i.outerHTML).toStrictEqual('<i class="some class">text</i>')
  expect(b.outerHTML).toStrictEqual('<b><i class="some class">text</i></b>')
})

test('h: innerText vs items', () => {
  expect(h('span', 'text').outerHTML).toStrictEqual('<span>text</span>')
  expect(h('span', { $innerText: 'text' }).outerHTML).toStrictEqual('<span>text</span>')
})

test('h: style', () => {
  expect(h('div', { style: 'margin:0;padding:0' }).outerHTML)
    .toStrictEqual('<div style="margin:0;padding:0"></div>')
  expect(h('div', { $style: 'margin:0;padding:0' }).outerHTML)
    .toStrictEqual('<div style="margin: 0px; padding: 0px;"></div>')
  expect(h('div', { $style: { margin: 0, padding: 0 } }).outerHTML)
    .toStrictEqual('<div style="margin: 0px; padding: 0px;"></div>')
})

test('h: attributes vs properties', () => {
  const input1 = h('input', { value: 42 })
  const input2 = h('input', { $value: '42' })

  expect(input1.value).toStrictEqual('42')
  expect(input2.value).toStrictEqual('42')

  expect(input1.outerHTML).toStrictEqual('<input value="42">')
  expect(input2.outerHTML).toStrictEqual('<input>')

  const checkbox1 = h('input', { type: 'checkbox', checked: true })
  const checkbox2 = h('input', { type: 'checkbox', $checked: true })

  expect(checkbox1.checked).toBeTrue()
  expect(checkbox2.checked).toBeTrue()

  expect(checkbox1.outerHTML).toStrictEqual('<input type="checkbox" checked="">')
  expect(checkbox2.outerHTML).toStrictEqual('<input type="checkbox">')
})

test('h: nested properties', () => {
  const div = h('div')

  // @ts-expect-error
  expect(div.key).toBeUndefined()

  h(div, { $key: { one: 1 } })

  // @ts-expect-error
  expect(div.key).toStrictEqual({ one: 1 })

  h(div, { $key: { two: 2 } })

  // @ts-expect-error
  expect(div.key).toStrictEqual({ one: 1, two: 2 })
})
