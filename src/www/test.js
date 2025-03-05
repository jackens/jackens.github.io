import {
  c,
  csvParse,
  escape,
  escapeValues,
  fixTypography,
  h,
  hasOwn,
  isArray,
  isNumber,
  isRecord,
  isString,
  jsOnParse,
  locale,
  nanolightJs,
  omit,
  pick,
  plUral,
  pro,
  uuid1
} from '../../dist/nnn.js'
// @ts-expect-error
import { expect } from '../../node_modules/chai/chai.js'

/** @import { EscapeMap } from '../../dist/nnn.js' */

const test = (/** @type {string} */ _title, /** @type {() => void} */ handler) => handler()

test('c: #1', () => {
  const actual = c({
    a: {
      color: 'red',
      margin: 1,
      '.c': { margin: 2, padding: 2 },
      padding: 1
    }
  })

  const expected = `
  a{
    color:red;
    margin:1
  }
  a.c{
    margin:2;
    padding:2
  }
  a{
    padding:1
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('c: #2', () => {
  const actual = c({
    a: {
      '.b': {
        color: 'red',
        margin: 1,
        '.c': { margin: 2, padding: 2 },
        padding: 1
      }
    }
  })

  const expected = `
  a.b{
    color:red;
    margin:1
  }
  a.b.c{
    margin:2;
    padding:2
  }
  a.b{
    padding:1
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('c: #3', () => {
  const actual = c({
    '@font-face$$1': {
      fontFamily: 'Jackens',
      src$$1: 'url(otf/jackens.otf)',
      src$$2: "url(otf/jackens.otf) format('opentype')," +
        "url(svg/jackens.svg) format('svg')",
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    '@font-face$$2': {
      fontFamily: 'C64',
      src: 'url(fonts/C64_Pro_Mono-STYLE.woff)'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    div: {
      border: 'solid red 1px',
      '.c1': { 'background-color': '#000' },
      ' .c1': { backgroundColor: 'black' },
      '.c2': { backgroundColor: 'rgb(0,0,0)' }
    },
    '@media(min-width:200px)': {
      div: { margin: 0, padding: 0 },
      span: { color: '#000' }
    }
  })

  const expected = `
  @font-face{
    font-family:Jackens;
    src:url(otf/jackens.otf);
    src:url(otf/jackens.otf) format('opentype'),url(svg/jackens.svg) format('svg');
    font-weight:normal;
    font-style:normal
  }
  @font-face{
    font-family:C64;
    src:url(fonts/C64_Pro_Mono-STYLE.woff)
  }
  @keyframes spin{
    0%{
      transform:rotate(0deg)
    }
    100%{
      transform:rotate(360deg)
    }
  }
  div{
    border:solid red 1px
  }
  div.c1{
    background-color:#000
  }
  div .c1{
    background-color:black
  }
  div.c2{
    background-color:rgb(0,0,0)
  }
  @media(min-width:200px){
    div{
      margin:0;
      padding:0
    }
    span{
      color:#000
    }
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('c: #4', () => {
  const actual = c({
    a: {
      '.b,.c': {
        margin: 1,
        '.d': {
          margin: 2
        }
      }
    }
  })

  const expected = `
  a.b,a.c{
    margin:1
  }
  a.b.d,a.c.d{
    margin:2
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('c: #5', () => {
  const actual = c({
    '.b,.c': {
      margin: 1,
      '.d': {
        margin: 2
      }
    }
  })

  const expected = `
  .b,.c{
    margin:1
  }
  .b.d,.c.d{
    margin:2
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('c: #6', () => {
  const actual = c({
    '.a,.b': {
      margin: 1,
      '.c,.d': {
        margin: 2
      }
    }
  })

  const expected = `
  .a,.b{
    margin:1
  }
  .a.c,.a.d,.b.c,.b.d{
    margin:2
  }`.replace(/\n\s*/g, '')

  expect(actual).to.deep.equal(expected)
})

test('csvParse:', () => {
  const text = `"aaa
""aaa""
aaa",bbb, "ccc,ccc"
"xxx,xxx", "yyy
yyy",zzz
 42 , "42" , 17

`
  expect(csvParse(text, { header: false })).to.deep.equal([
    ['aaa\n"aaa"\naaa', 'bbb', 'ccc,ccc'],
    ['xxx,xxx', 'yyy\nyyy', 'zzz'],
    [' 42 ', '42', ' 17']
  ])

  expect(csvParse(text)).to.deep.equal([{
    'aaa\n"aaa"\naaa': 'xxx,xxx',
    bbb: 'yyy\nyyy',
    'ccc,ccc': 'zzz'
  }, {
    'aaa\n"aaa"\naaa': ' 42 ',
    bbb: '42',
    'ccc,ccc': ' 17'
  }])
})

test('escape:', () => {
  // @ts-expect-error
  const /** @type {EscapeMap} */ escapeMap = new Map([
    [undefined, () => 'NULL'],
    [Array, (/** @type {Partial<Array<unknown>>} */ values) => escapeValues(escapeMap, values).join(', ')],
    [Boolean, (/** @type {boolean} */ value) => `b'${+value}'`],
    [Date, (/** @type {Date} */ value) => `'${value.toISOString().replace(/^(.+)T(.+)\..*$/, '$1 $2')}'`],
    [Number, (/** @type {number} */ value) => `${value}`],
    [String, (/** @type {string} */ value) => `'${value.replace(/'/g, "''")}'`]
  ])

  const sql = escape.bind(null, escapeMap)

  const actual = sql`
    SELECT *
    FROM table_name
    WHERE column_name IN (${[true, null, undefined, 42, '42', "4'2", /42/, new Date(323325000000)]})`

  const expected = `
    SELECT *
    FROM table_name
    WHERE column_name IN (b'1', NULL, NULL, 42, '42', '4''2', NULL, '1980-03-31 04:30:00')`

  expect(actual).to.deep.equal(expected)
})

test('fixTypography:', () => {
  const p = h('p', 'Pchnąć w tę łódź jeża lub ośm skrzyń fig (zob. https://pl.wikipedia.org/wiki/Pangram).')

  fixTypography(p)

  expect(p.innerHTML).to.deep.equal(
    'Pchnąć <span style="white-space:nowrap">w </span>tę łódź jeża lub ośm skrzyń fig ' +
    '(zob. https://\u200Bpl.\u200Bwikipedia.\u200Borg/\u200Bwiki/\u200BPangram).')
})

test('h:', () => {
  const b = h('b')

  expect(b.outerHTML).to.deep.equal('<b></b>')

  const i = h('i', 'text')

  h(b, i)

  expect(i.outerHTML).to.deep.equal('<i>text</i>')
  expect(b.outerHTML).to.deep.equal('<b><i>text</i></b>')

  h(i, { $className: 'some class' })

  expect(i.outerHTML).to.deep.equal('<i class="some class">text</i>')
  expect(b.outerHTML).to.deep.equal('<b><i class="some class">text</i></b>')
})

test('h: innerText vs items', () => {
  expect(h('span', 'text').outerHTML).to.deep.equal('<span>text</span>')
  expect(h('span', { $innerText: 'text' }).outerHTML).to.deep.equal('<span>text</span>')
})

test('h: style', () => {
  expect(h('div', { style: 'margin:0;padding:0' }).outerHTML)
    .to.deep.equal('<div style="margin:0;padding:0"></div>')
  expect(h('div', { $style: 'margin:0;padding:0' }).outerHTML)
    .to.deep.equal('<div style="margin: 0px; padding: 0px;"></div>')
  expect(h('div', { $style: { margin: 0, padding: 0 } }).outerHTML)
    .to.deep.equal('<div style="margin: 0px; padding: 0px;"></div>')
})

test('h: attributes vs properties', () => {
  const input1 = h('input', { value: 42 })
  const input2 = h('input', { $value: '42' })

  expect(input1.value).to.deep.equal('42')
  expect(input2.value).to.deep.equal('42')

  expect(input1.outerHTML).to.deep.equal('<input value="42">')
  expect(input2.outerHTML).to.deep.equal('<input>')

  const checkbox1 = h('input', { type: 'checkbox', checked: true })
  const checkbox2 = h('input', { type: 'checkbox', $checked: true })

  expect(checkbox1.checked).to.be.true
  expect(checkbox2.checked).to.be.true

  expect(checkbox1.outerHTML).to.deep.equal('<input type="checkbox" checked="">')
  expect(checkbox2.outerHTML).to.deep.equal('<input type="checkbox">')
})

test('h: nested properties', () => {
  const div = h('div')

  // @ts-expect-error
  expect(div.key).to.be.undefined

  h(div, { $key: { one: 1 } })

  // @ts-expect-error
  expect(div.key).to.deep.equal({ one: 1 })

  h(div, { $key: { two: 2 } })

  // @ts-expect-error
  expect(div.key).to.deep.equal({ one: 1, two: 2 })
})

test('hasOwn:', () => {
  const obj = { 42: null, null: 'k,e,y', 'k,e,y': 42 }

  expect(42 in obj).to.be.true
  expect(hasOwn(obj, 42)).to.be.true

  expect('42' in obj).to.be.true
  expect(hasOwn(obj, '42')).to.be.true

  expect('null' in obj).to.be.true
  expect(hasOwn(obj, 'null')).to.be.true

  // @ts-expect-error
  expect(null in obj).to.be.true
  expect(hasOwn(obj, null)).to.be.true

  expect('k,e,y' in obj).to.be.true
  expect(hasOwn(obj, 'k,e,y')).to.be.true

  // @ts-expect-error
  expect(['k', 'e', 'y'] in obj).to.be.true
  expect(hasOwn(obj, ['k', 'e', 'y'])).to.be.true

  expect('toString' in obj).to.be.true
  expect(hasOwn(obj, 'toString')).to.be.false

  // @ts-expect-error
  expect(() => 'key' in null).to.throw
  expect(hasOwn(null, 'key')).to.be.false

  // @ts-expect-error
  expect(() => 'key' in undefined).to.throw
  expect(hasOwn(undefined, 'key')).to.be.false
})

test('is:', () => {
  expect(isArray([])).to.be.true

  expect(isNumber(42)).to.be.true
  expect(isNumber(Number(42))).to.be.true
  // eslint-disable-next-line no-new-wrappers
  expect(isNumber(new Number(42))).to.be.false
  expect(isNumber(NaN)).to.be.true

  expect(isRecord({})).to.be.true
  expect(isRecord([])).to.be.false
  expect(isRecord(Object.create(null))).to.be.true
  expect(isRecord(Object.create({ constructor: Number }))).to.be.true
  expect(isRecord(Object.create({ [Symbol.toStringTag]: Number.name }))).to.be.true
  // eslint-disable-next-line no-new-wrappers
  expect(isRecord(new Number(42))).to.be.true
  // eslint-disable-next-line no-new-wrappers
  expect(isRecord(new String('42'))).to.be.true

  class FooBar { }
  expect(isRecord(new FooBar())).to.be.true

  expect(isString('42')).to.be.true
  expect(isString(String('42'))).to.be.true
  // eslint-disable-next-line no-new-wrappers
  expect(isString(new String('42'))).to.be.false
})

test('jsOnParse:', () => {
  const handlers = {
    $hello: (/** @type {string} */ name) => `Hello ${name}!`,
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

  expect(actual).to.deep.equal(expected)
})

test('locale:', () => {
  const _ = locale({
    default: { Password: 'Hasło' },
    button: { Login: 'Zaloguj' }
  }, 'default')

  expect(_('Login')).to.deep.equal('Login')
  expect(_('Password')).to.deep.equal('Hasło')

  expect(_('Undefined text')).to.deep.equal('Undefined text')

  expect(_('Login', 'button')).to.deep.equal('Zaloguj')

  expect(_('Password', 'undefined_version')).to.deep.equal('Hasło')
  expect(_('Undefined text', 'undefined_version')).to.deep.equal('Undefined text')

  expect(_('toString')).to.deep.equal('toString')
  expect(_('toString', 'undefined_version')).to.deep.equal('toString')
})

test('nanolightJs:', () => {
  const codeJs = 'const answerToLifeTheUniverseAndEverything = 42'

  expect(nanolightJs(codeJs)).to.deep.equal([
    ['span', { class: 'keyword' }, 'const'],
    ' ',
    ['span', { class: 'literal' }, 'answerToLifeTheUniverseAndEverything'],
    ' ',
    ['span', { class: 'operator' }, '='],
    ' ',
    ['span', { class: 'number' }, '42']
  ])
})

test('omit:', () => {
  const obj = { a: 42, b: '42', c: 17 }

  expect(omit(obj, ['c'])).to.deep.equal({ a: 42, b: '42' })
})

test('pick:', () => {
  const obj = { a: 42, b: '42', c: 17 }

  expect(pick(obj, ['a', 'b'])).to.deep.equal({ a: 42, b: '42' })
})

test('plUral:', () => {
  const auto = plUral.bind(null, 'auto', 'auta', 'aut')

  expect(auto(0)).to.deep.equal('aut')
  expect(auto(1)).to.deep.equal('auto')
  expect(auto(17)).to.deep.equal('aut')
  expect(auto(42)).to.deep.equal('auta')

  const car = plUral.bind(null, 'car', 'cars', 'cars')

  expect(car(0)).to.deep.equal('cars')
  expect(car(1)).to.deep.equal('car')
  expect(car(17)).to.deep.equal('cars')
  expect(car(42)).to.deep.equal('cars')
})

test('pro:', () => {
  const ref = {}

  pro(ref).one.two[3][4] = 1234

  expect(ref).to.deep.equal({ one: { two: { 3: { 4: 1234 } } } })

  pro(ref).one.two.tree = 123

  expect(ref).to.deep.equal({ one: { two: { 3: { 4: 1234 }, tree: 123 } } })

  pro(ref).one.two = undefined

  expect(ref).to.deep.equal({ one: { two: undefined } })

  delete pro(ref).one.two

  expect(ref).to.deep.equal({ one: {} })

  pro(ref).one.two.three.four

  expect(ref).to.deep.equal({ one: { two: { three: { four: {} } } } })

  pro(ref).one.two.three.four = 1234

  expect(ref).to.deep.equal({ one: { two: { three: { four: 1234 } } } })
})

test('uuid1:', () => {
  for (let i = 1; i <= 22136; ++i) {
    const uuid = uuid1()

    i === 1 && expect(uuid.split('-')[3]).to.deep.equal('8001')
    i === 4095 && expect(uuid.split('-')[3]).to.deep.equal('8fff')
    i === 4096 && expect(uuid.split('-')[3]).to.deep.equal('9000')
    i === 9029 && expect(uuid.split('-')[3]).to.deep.equal('a345')
    i === 13398 && expect(uuid.split('-')[3]).to.deep.equal('b456')
    i === 16384 && expect(uuid.split('-')[3]).to.deep.equal('8000')
    i === 17767 && expect(uuid.split('-')[3]).to.deep.equal('8567')
  }
})

test('uuid1: node', () => {
  expect(uuid1(new Date(), '000123456789abc').split('-')[4]).to.deep.equal('123456789abc')
  expect(uuid1(new Date(), '123456789').split('-')[4]).to.deep.equal('000123456789')
})

test('uuid1: date', () => {
  expect(uuid1(new Date(323325000000)).startsWith('c1399400-9a71-11bd')).to.be.true
})
