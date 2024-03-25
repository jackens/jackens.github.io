# nnn

Jackens’ JavaScript helpers.

<sub>Version: <code class="version">2024.3.25</code></sub>

## Examples

- [Chessboard Demo](https://jackens.github.io/nnn/chessboard/)
- [Documentation](https://jackens.github.io/nnn/doc/)
- [Gant Chart Demo](https://jackens.github.io/nnn/gantt/)
- [Responsive Web Design Demo](https://jackens.github.io/nnn/rwd/)

## Installation

```sh
bun i @jackens/nnn
```

or

```sh
npm i @jackens/nnn
```

## Usage

Bun (or Node.js):

```js
import { «something» } from '@jackens/nnn'
```

The browser (or Bun or Node.js):

```js
import { «something» } from './node_modules/@jackens/nnn/nnn.js'
```

## Exports

- `EscapeMap`: The type of arguments of the `escapeValues` and `escape` helpers.
- `HArgs`: The type of arguments of the `h` and `s` helpers.
- `HArgs1`: The type of arguments of the `h` and `s` helpers.
- `JcNode`: The type of arguments of the `jc` helper.
- `JcRoot`: The type of arguments of the `jc` helper.
- `escape`: A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).
- `escapeValues`: A generic helper for escaping `values` by given `escapeMap`.
- `fixTypography`: A helper that implements typographic corrections specific to Polish typography.
- `h`: A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `HTMLElement`s (see also `s`).
- `has`: A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.
- `is`: A helper that checks if the given argument is of a certain type.
- `jc`: A simple JS-to-CSS (aka CSS-in-JS) helper.
- `jsOnParse`: `JSON.parse` with “JavaScript turned on”.
- `locale`: Language translations helper.
- `nanolight`: A generic helper for syntax highlighting (see also `nanolightJs`).
- `nanolightJs`: A helper for highlighting JavaScript.
- `omit`: A helper that implements TypeScript’s `Omit` utility type.
- `pick`: A helper that implements TypeScript’s `Pick` utility type.
- `plUral`: A helper for choosing the correct singular and plural.
- `pro`: A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty object.
- `refsInfo`: A helper that provides information about the given `refs`.
- `s`: A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `SVGElement`s (see also `h`).
- `svgUse`: A convenient shortcut for `s('svg', ['use', { 'xlink:href': '#' + id }], ...args)`.
- `uuid1`: A helper that generates a UUID v1 identifier (with a creation timestamp).

### EscapeMap

```ts
type EscapeMap = Map<any, (value?: any) => string>;
```

The type of arguments of the `escapeValues` and `escape` helpers.

### HArgs

```ts
type HArgs = [string | Node, ...HArgs1[]];
```

The type of arguments of the `h` and `s` helpers.

### HArgs1

```ts
type HArgs1 = Partial<Record<PropertyKey, any>> | null | undefined | Node | string | number | HArgs;
```

The type of arguments of the `h` and `s` helpers.

### JcNode

```ts
type JcNode = {
    [attributeOrSelector: string]: string | number | JcNode | undefined;
};
```

The type of arguments of the `jc` helper.

### JcRoot

```ts
type JcRoot = Partial<Record<PropertyKey, JcNode>>;
```

The type of arguments of the `jc` helper.

### escape

```ts
const escape: (escapeMap: EscapeMap, template: TemplateStringsArray, ...values: Partial<Array<any>>) => string;
```

A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).

#### Usage Examples

```js
const escapeMap: EscapeMap = new Map([
  [undefined, () => 'NULL'],
  [Array, (values: Partial<Array<any>>) => escapeValues(escapeMap, values).join(', ')],
  [Boolean, (value: boolean) => `b'${+value}'`],
  [Date, (value: Date) => `'${value.toISOString().replace(/^(.+)T(.+)\..*$/, '$1 $2')}'`],
  [Number, (value: number) => `${value}`],
  [String, (value: string) => `'${value.replace(/'/g, "''")}'`]
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

expect(actual).toStrictEqual(expected)
```

### escapeValues

```ts
const escapeValues: (escapeMap: EscapeMap, values: Partial<Array<any>>) => Partial<Array<string>>;
```

A generic helper for escaping `values` by given `escapeMap`.

### fixTypography

```ts
const fixTypography: (node: Node) => void;
```

A helper that implements typographic corrections specific to Polish typography.

#### Usage Examples

```js
const p = h('p', 'Pchnąć w tę łódź jeża lub ośm skrzyń fig (zob. https://pl.wikipedia.org/wiki/Pangram).')

fixTypography(p)

expect(p.innerHTML).toStrictEqual(
  'Pchnąć <span style="white-space:nowrap">w </span>tę łódź jeża lub ośm skrzyń fig ' +
  '(zob. https://\u200Bpl.\u200Bwikipedia.\u200Borg/\u200Bwiki/\u200BPangram).')
```

### h

```ts
const h: {
    <T extends keyof HTMLElementTagNameMap>(tag: T, ...args1: Partial<Array<HArgs1>>): HTMLElementTagNameMap[T];
    <N extends Node>(node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
};
```

A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `HTMLElement`s (see also `s`).

- The first argument of type `string` specifies the tag of the element to be created.
- The first argument of type `Node` specifies the element to be modified.
- All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
  Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
  (Note that `$` is not a valid attribute name character.)
  All other keys specify *attributes* to be set by `setAttribute`.
  An attribute equal to `false` causes the attribute to be removed by `removeAttribute`.
- All other arguments of type `null` or `undefined` are simply ignored.
- All other arguments of type `Node` are appended to the element being created or modified.
- All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
- All other arguments of type `HArgs` are passed to `h` and the results are appended to the element being created or modified.

#### Usage Examples

```js
const b = h('b')

expect(b.outerHTML).toStrictEqual('<b></b>')

const i = h('i', 'text')

h(b, i)

expect(i.outerHTML).toStrictEqual('<i>text</i>')
expect(b.outerHTML).toStrictEqual('<b><i>text</i></b>')

h(i, { $className: 'some class' })

expect(i.outerHTML).toStrictEqual('<i class="some class">text</i>')
expect(b.outerHTML).toStrictEqual('<b><i class="some class">text</i></b>')
```

```js
expect(h('span', 'text').outerHTML).toStrictEqual('<span>text</span>')
expect(h('span', { $innerText: 'text' }).outerHTML).toStrictEqual('<span>text</span>')
```

```js
expect(h('div', { style: 'margin:0;padding:0' }).outerHTML)
  .toStrictEqual('<div style="margin:0;padding:0"></div>')
expect(h('div', { $style: 'margin:0;padding:0' }).outerHTML)
  .toStrictEqual('<div style="margin: 0px; padding: 0px;"></div>')
expect(h('div', { $style: { margin: 0, padding: 0 } }).outerHTML)
  .toStrictEqual('<div style="margin: 0px; padding: 0px;"></div>')
```

```js
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
```

```js
const div = h('div')

expect(div.key).toBeUndefined()

h(div, { $key: { one: 1 } })

expect(div.key).toStrictEqual({ one: 1 })

h(div, { $key: { two: 2 } })

expect(div.key).toStrictEqual({ one: 1, two: 2 })
```

### has

```ts
const has: (key: any, ref: any) => boolean;
```

A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.

#### Usage Examples

```js
const obj = { key: 'K', null: 'N' }

expect('key' in obj).toBeTrue()
expect(has('key', obj)).toBeTrue()

expect('null' in obj).toBeTrue()
expect(has('null', obj)).toBeTrue()

expect(null in obj).toBeTrue()
expect(has(null, obj)).toBeFalse()

expect('toString' in obj).toBeTrue()
expect(has('toString', obj)).toBeFalse()
```

```js
let typeError

try {
  'key' in null
} catch (error) {
  typeError = error
}

expect(typeError instanceof TypeError) // Cannot use 'in' operator to search for 'key' in null
expect(has('key', null)).toBeFalse()
```

### is

```ts
const is: {
    (type: ArrayConstructor, arg: any): arg is Partial<Array<any>>;
    (type: BigIntConstructor, arg: any): arg is bigint;
    (type: BooleanConstructor, arg: any): arg is boolean;
    (type: NumberConstructor, arg: any): arg is number;
    (type: ObjectConstructor, arg: any): arg is Partial<Record<PropertyKey, any>>;
    (type: StringConstructor, arg: any): arg is string;
    (type: SymbolConstructor, arg: any): arg is symbol;
    (type: undefined, arg: any): arg is undefined | null;
    <T extends abstract new (...args: Partial<Array<any>>) => any>(type: T, arg: any): arg is InstanceType<T>;
};
```

A helper that checks if the given argument is of a certain type.

#### Usage Examples

```js
expect(is(Number, 42)).toBeTrue()
expect(is(Number, Number(42))).toBeTrue()
expect(is(Number, new Number(42))).toBeTrue()
expect(is(Number, NaN)).toBeTrue()
expect(is(String, '42')).toBeTrue()
expect(is(String, String('42'))).toBeTrue()
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
```

```js
const iz = (type: any, arg: any) => ({}).toString.call(arg).slice(8, -1) === type?.name

class FooBar { }

expect(is(FooBar, new FooBar())).toBeTrue()
expect(iz(FooBar, new FooBar())).toBeFalse()

expect(is(Object, new FooBar())).toBeFalse()
expect(iz(Object, new FooBar())).toBeTrue()

const fakeFooBar = {}

fakeFooBar[Symbol.toStringTag] = FooBar.name

expect(is(FooBar, fakeFooBar)).toBeFalse()
expect(iz(FooBar, fakeFooBar)).toBeTrue()

expect(is(Object, fakeFooBar)).toBeTrue()
expect(iz(Object, fakeFooBar)).toBeFalse()
```

```js
const num = 42
const str = '42'

expect(is(Number, num)).toBeTrue()

try {
  num.constructor = str.constructor
} catch { /* empty */ }

expect(is(Number, num)).toBeTrue()
```

### jc

```ts
const jc: (root: JcRoot, splitter?: string) => string;
```

A simple JS-to-CSS (aka CSS-in-JS) helper.

The `root` parameter provides a hierarchical description of CSS rules.

- Keys of sub-objects whose values are NOT objects are treated as CSS attribute, and values are treated as values of those CSS attributes; the concatenation of keys of all parent objects is a CSS rule.
- All keys ignore the part starting with a splitter (default: `$$`) sign until the end of the key (e.g. `src$$1` → `src`, `@font-face$$1` → `@font-face`).
- In keys specifying CSS attribute, all uppercase letters are replaced by lowercase letters with an additional `-` character preceding them (e.g. `fontFamily` → `font-family`).
- Commas in keys that makes a CSS rule cause it to “split” and create separate rules for each part (e.g. `{div:{margin:1,'.a,.b,.c':{margin:2}}}` → `div{margin:1}div.a,div.b,div.c{margin:2}`).
- Top-level keys that begin with `@` are not concatenated with sub-object keys.

#### Usage Examples

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

```js
const actual = jc({
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

expect(actual).toStrictEqual(expected)
```

### jsOnParse

```ts
const jsOnParse: (handlers: Partial<Record<PropertyKey, Function>>, text: string) => any;
```

`JSON.parse` with “JavaScript turned on”.

Objects having *exactly* one property which is present in the `handlers` map, i.e. objects of the form:

```js
{ "«handlerName»": [«params»] }
```

are replaced by the result of call

```js
handlers['«handlerName»'](...«params»)
```

#### Usage Examples

```js
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
```

### locale

```ts
const locale: (map: Partial<Record<PropertyKey, Partial<Record<PropertyKey, string>>>>, defaultVersion: string) => (text: string, version?: string) => string;
```

Language translations helper.

#### Usage Examples

```js
const _ = locale({
  default: { Password: 'Hasło' },
  button: { Login: 'Zaloguj' }
}, 'default')

expect(_('Login')).toStrictEqual('Login')
expect(_('Password')).toStrictEqual('Hasło')

expect(_('Undefined text')).toStrictEqual('Undefined text')

expect(_('Login', 'button')).toStrictEqual('Zaloguj')

expect(_('Password', 'undefined_version')).toStrictEqual('Hasło')
expect(_('Undefined text', 'undefined_version')).toStrictEqual('Undefined text')

expect(_('toString')).toStrictEqual('toString')
expect(_('toString', 'undefined_version')).toStrictEqual('toString')
```

### nanolight

```ts
const nanolight: (pattern: RegExp, highlighters: ((chunk: string, index: number) => HArgs1)[], code: string) => HArgs1[];
```

A generic helper for syntax highlighting (see also `nanolightJs`).

### nanolightJs

```ts
const nanolightJs: (code: string) => HArgs1[];
```

A helper for highlighting JavaScript.

#### Usage Examples

```js
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
```

### omit

```ts
const omit: <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>) => Omit<T, K[number]>;
```

A helper that implements TypeScript’s `Omit` utility type.

#### Usage Examples

```js
const obj = { a: 42, b: '42', c: 17 }

expect(omit(obj, ['c'])).toStrictEqual({ a: 42, b: '42' })
```

### pick

```ts
const pick: <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>) => Pick<T, K[number]>;
```

A helper that implements TypeScript’s `Pick` utility type.

#### Usage Examples

```js
const obj = { a: 42, b: '42', c: 17 }

expect(pick(obj, ['a', 'b'])).toStrictEqual({ a: 42, b: '42' })
```

### plUral

```ts
const plUral: (singular: string, plural2: string, plural5: string, value: number) => string;
```

A helper for choosing the correct singular and plural.

#### Usage Examples

```js
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
```

### pro

```ts
const pro: (ref: any) => any;
```

A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty object.

#### Usage Examples

```js
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
```

### refsInfo

```ts
const refsInfo: (...refs: Partial<Array<any>>) => [string, string, (string | undefined)[]][];
```

A helper that provides information about the given `refs`.

It returns an array of triples: `[«name», «prototype-name», «array-of-own-property-names»]`.

#### Usage Examples

```js
const info = refsInfo(Array, Function)

expect(info.find(([name]) => name === 'Array')?.[2]?.includes('length')).toBeTrue()
expect(info.find(([name]) => name === 'Function')?.[2]?.includes('length')).toBeTrue()
```

```js
const browserFingerprint = () => {
  const refs = Object.getOwnPropertyNames(window).map(name => window[name])
  const info = refsInfo(...refs)
  const json = JSON.stringify(info)
  const hash = Array(32).fill(0)
  let j = 0

  for (let i = 0; i < json.length; i++) {
    let charCode = json.charCodeAt(i)

    while (charCode > 0) {
      hash[j] = hash[j] ^ (charCode & 15)
      charCode >>= 4
      j = (j + 1) & 31
    }
  }

  return hash.map(x => x.toString(16)).join('')
}

console.log(browserFingerprint())
```

### s

```ts
const s: {
    <T extends keyof SVGElementTagNameMap>(tag: T, ...args1: Partial<Array<HArgs1>>): SVGElementTagNameMap[T];
    <N extends Node>(node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
};
```

A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `SVGElement`s (see also `h`).

- The first argument of type `string` specifies the tag of the element to be created.
- The first argument of type `Node` specifies the element to be modified.
- All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
  Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
  (Note that `$` is not a valid attribute name character.)
  All other keys specify *attributes* to be set by `setAttributeNS`.
  An attribute equal to `false` causes the attribute to be removed by `removeAttributeNS`.
- All other arguments of type `null` or `undefined` are simply ignored.
- All other arguments of type `Node` are appended to the element being created or modified.
- All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
- All other arguments of type `HArgs` are passed to `s` and the results are appended to the element being created or modified.

### svgUse

```ts
const svgUse: (id: string, ...args: Partial<Array<HArgs1>>) => SVGSVGElement;
```

A convenient shortcut for `s('svg', ['use', { 'xlink:href': '#' + id }], ...args)`.

### uuid1

```ts
const uuid1: ({ date, node }?: {
    date?: Date | undefined;
    node?: string | undefined;
}) => string;
```

A helper that generates a UUID v1 identifier (with a creation timestamp).

- The optional `node` parameter should have the format `/^[0123456789abcdef]+$/`.
  Its value will be trimmed to last 12 characters and left padded with zeros.

#### Usage Examples

```js
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
```

```js
expect(uuid1({ node: '000123456789abc' }).split('-')[4]).toStrictEqual('123456789abc')
expect(uuid1({ node: '123456789' }).split('-')[4]).toStrictEqual('000123456789')
```

```js
expect(uuid1({ date: new Date(323325000000) }).startsWith('c1399400-9a71-11bd')).toBeTrue()
```

## License

The MIT License (MIT)

Copyright (c) 2016+ Jackens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
