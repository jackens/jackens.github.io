# nnn

Jackens’ JavaScript helpers.

## Installation

```sh
bun i @jackens/nnn
```

or

```sh
npm i @jackens/nnn
```

## Usage

```js
import { «something» } from '@jackens/nnn'
```

or

```js
import { «something» } from './node_modules/@jackens/nnn/nnn.js'
```

## Exports

- `CNode`: The type of arguments of the `c` helper.
- `CRoot`: The type of arguments of the `c` helper.
- `EscapeMap`: The type of arguments of the `escapeValues` and `escape` helpers.
- `HArgs`: The type of arguments of the `h` and `s` helpers.
- `HArgs1`: The type of arguments of the `h` and `s` helpers.
- `c`: A simple JS-to-CSS (aka CSS-in-JS) helper.
- `csvParse`: A tiny helper for CSV parsing.
- `escape`: A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).
- `escapeValues`: A generic helper for escaping `values` by given `escapeMap`.
- `fixTypography`: A helper that implements typographic corrections specific to Polish typography.
- `h`: A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `HTMLElement`s (see also `s`).
- `hasOwn`: A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.
- `isArray`: A helper that checks if the given argument is of type `any[]`.
- `isNumber`: A helper that checks if the given argument is of type `number`.
- `isRecord`: A helper that checks if the given argument is of type `Partial<Record<PropertyKey, unknown>>`.
- `isString`: A helper that checks if the given argument is of type `string`.
- `jsOnParse`: `JSON.parse` with “JavaScript turned on”.
- `nanolight`: A generic helper for syntax highlighting (see also `nanolightJs`).
- `nanolightJs`: A helper for highlighting JavaScript (see also `nanolight`).
- `omit`: A helper that implements TypeScript’s `Omit` utility type (see also `pick`).
- `pick`: A helper that implements TypeScript’s `Pick` utility type (see also `omit`).
- `plUral`: A helper for choosing the correct singular and plural.
- `pro`: A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty
- `s`: A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `SVGElement`s (see also `h`).
- `svgUse`: A convenient shortcut for `s('svg', ['use', { 'xlink:href': '#' + id }], ...args)`.
- `uuid1`: A helper that generates a UUID v1 identifier (with a creation timestamp).

### CNode

```ts
type CNode = {
    [attributeOrSelector: string]: string | number | CNode | undefined;
};
```

The type of arguments of the `c` helper.

### CRoot

```ts
type CRoot = Partial<Record<PropertyKey, CNode>>;
```

The type of arguments of the `c` helper.

### EscapeMap

```ts
type EscapeMap = Map<unknown, (value?: unknown) => string>;
```

The type of arguments of the `escapeValues` and `escape` helpers.

### HArgs

```ts
type HArgs = [string | Node, ...HArgs1[]];
```

The type of arguments of the `h` and `s` helpers.

### HArgs1

```ts
type HArgs1 = Partial<Record<PropertyKey, unknown>> | null | undefined | Node | string | number | HArgs;
```

The type of arguments of the `h` and `s` helpers.

### c

```ts
const c: (root: CRoot, splitter?: string) => string;
```

A simple JS-to-CSS (aka CSS-in-JS) helper.

The `root` parameter provides a hierarchical description of CSS rules.

- Keys of sub-objects whose values are NOT objects are treated as CSS attribute, and values are treated as values of those CSS attributes; the concatenation of keys of all parent objects is a CSS rule.
- All keys ignore the part starting with a splitter (default: `$$`) sign until the end of the key (e.g. `src$$1` → `src`, `@font-face$$1` → `@font-face`).
- In keys specifying CSS attribute, all uppercase letters are replaced by lowercase letters with an additional `-` character preceding them (e.g. `fontFamily` → `font-family`).
- Commas in keys that makes a CSS rule cause it to “split” and create separate rules for each part (e.g. `{div:{margin:1,'.a,.b,.c':{margin:2}}}` → `div{margin:1}div.a,div.b,div.c{margin:2}`).
- Top-level keys that begin with `@` are not concatenated with sub-object keys.

#### Usage Examples

```ts
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
```

```ts
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
```

```ts
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
```

```ts
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
```

```ts
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
```

```ts
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
```

### csvParse

```ts
const csvParse: {
    (text: string): Partial<Array<Partial<Record<PropertyKey, string>>>>;
    <HeaderTrue extends {
        header: true;
    }>(text: string, config: HeaderTrue): Partial<Array<Partial<Record<PropertyKey, string>>>>;
    <HeaderFalse extends {
        header: false;
    }>(text: string, config: HeaderFalse): Partial<Array<Partial<Array<string>>>>;
    (text: string, config: Partial<{
        header: boolean;
        separator: string;
    }>): Partial<Array<Partial<Record<PropertyKey, string>>>> | Partial<Array<Partial<Array<string>>>>;
};
```

A tiny helper for CSV parsing.

Options:
- `header`: flag indicating that the parsed CSV has a header row (default: `true`)
- `separator`: field separator (default: `','`)

#### Usage Examples

```ts
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
```

### escape

```ts
const escape: (escapeMap: EscapeMap, template: TemplateStringsArray, ...values: Partial<Array<unknown>>) => string;
```

A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).

#### Usage Examples

```ts
const escapeMap: EscapeMap = new Map([
  [undefined, () => 'NULL'],
  [Array, (values: Partial<Array<unknown>>) => escapeValues(escapeMap, values).join(', ')],
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

expect(actual).to.deep.equal(expected)
```

### escapeValues

```ts
const escapeValues: (escapeMap: EscapeMap, values: Partial<Array<unknown>>) => Partial<Array<string>>;
```

A generic helper for escaping `values` by given `escapeMap`.

### fixTypography

```ts
const fixTypography: (node: Node) => void;
```

A helper that implements typographic corrections specific to Polish typography.

#### Usage Examples

```ts
const p = h('p', 'Pchnąć w tę łódź jeża lub ośm skrzyń fig (zob. https://pl.wikipedia.org/wiki/Pangram).')

fixTypography(p)

expect(p.innerHTML).to.deep.equal(
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
- All other arguments of type `Partial<Record<PropertyKey, unknown>>` are mappings of attributes and properties. Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified. (Note that `$` is not a valid attribute name character.) All other keys specify *attributes* to be set by `setAttribute`. An attribute equal to `false` causes the attribute to be removed by `removeAttribute`.
- All other arguments of type `null` or `undefined` are simply ignored.
- All other arguments of type `Node` are appended to the element being created or modified.
- All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
- All other arguments of type `HArgs` are passed to `h` and the results are appended to the element being created or modified.

#### Usage Examples

```ts
const b = h('b')

expect(b.outerHTML).to.deep.equal('<b></b>')

const i = h('i', 'text')

h(b, i)

expect(i.outerHTML).to.deep.equal('<i>text</i>')
expect(b.outerHTML).to.deep.equal('<b><i>text</i></b>')

h(i, { $className: 'some class' })

expect(i.outerHTML).to.deep.equal('<i class="some class">text</i>')
expect(b.outerHTML).to.deep.equal('<b><i class="some class">text</i></b>')
```

```ts
expect(h('span', 'text').outerHTML).to.deep.equal('<span>text</span>')
expect(h('span', { $innerText: 'text' }).outerHTML).to.deep.equal('<span>text</span>')
```

```ts
expect(h('div', { style: 'margin:0;padding:0' }).outerHTML)
  .to.deep.equal('<div style="margin:0;padding:0"></div>')
expect(h('div', { $style: 'margin:0;padding:0' }).outerHTML)
  .to.deep.equal('<div style="margin: 0px; padding: 0px;"></div>')
expect(h('div', { $style: { margin: 0, padding: 0 } }).outerHTML)
  .to.deep.equal('<div style="margin: 0px; padding: 0px;"></div>')
```

```ts
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
```

```ts
const div = h('div')

expect(div.key).to.be.undefined

h(div, { $key: { one: 1 } })

expect(div.key).to.deep.equal({ one: 1 })

h(div, { $key: { two: 2 } })

expect(div.key).to.deep.equal({ one: 1, two: 2 })
```

### hasOwn

```ts
const hasOwn: (ref: unknown, key: unknown) => boolean;
```

A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.

#### Usage Examples

```ts
const obj = { 42: null, null: 'k,e,y', 'k,e,y': 42 }

expect(42 in obj).to.be.true
expect(hasOwn(obj, 42)).to.be.true

expect('42' in obj).to.be.true
expect(hasOwn(obj, '42')).to.be.true

expect('null' in obj).to.be.true
expect(hasOwn(obj, 'null')).to.be.true

expect(null in obj).to.be.true
expect(hasOwn(obj, null)).to.be.true

expect('k,e,y' in obj).to.be.true
expect(hasOwn(obj, 'k,e,y')).to.be.true

expect(['k', 'e', 'y'] in obj).to.be.true
expect(hasOwn(obj, ['k', 'e', 'y'])).to.be.true

expect('toString' in obj).to.be.true
expect(hasOwn(obj, 'toString')).to.be.false

expect(() => 'key' in null).to.throw
expect(hasOwn(null, 'key')).to.be.false

expect(() => 'key' in undefined).to.throw
expect(hasOwn(undefined, 'key')).to.be.false
```

### isArray

```ts
const isArray: (arg: any) => arg is any[];
```

A helper that checks if the given argument is of type `any[]`.

### isNumber

```ts
const isNumber: (arg: any) => arg is number;
```

A helper that checks if the given argument is of type `number`.

### isRecord

```ts
const isRecord: (arg: any) => arg is Partial<Record<PropertyKey, unknown>>;
```

A helper that checks if the given argument is of type `Partial<Record<PropertyKey, unknown>>`.

### isString

```ts
const isString: (arg: any) => arg is string;
```

A helper that checks if the given argument is of type `string`.

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

```ts
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

expect(actual).to.deep.equal(expected)
```

### nanolight

```ts
const nanolight: (pattern: RegExp, highlighters: Partial<Array<(chunk: string, index: number) => HArgs1>>, code: string) => HArgs1[];
```

A generic helper for syntax highlighting (see also `nanolightJs`).

### nanolightJs

```ts
const nanolightJs: (code: string) => HArgs1[];
```

A helper for highlighting JavaScript (see also `nanolight`).

#### Usage Examples

```ts
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
```

### omit

```ts
const omit: <T extends Partial<Record<PropertyKey, unknown>>, K extends Array<keyof T>>(obj: Partial<Record<PropertyKey, unknown>>, keys: Partial<Array<unknown>>) => Omit<T, K[number]>;
```

A helper that implements TypeScript’s `Omit` utility type (see also `pick`).

#### Usage Examples

```ts
const obj = { a: 42, b: '42', c: 17 }

expect(omit(obj, ['c'])).to.deep.equal({ a: 42, b: '42' })
```

### pick

```ts
const pick: <T extends Partial<Record<PropertyKey, unknown>>, K extends Array<keyof T>>(obj: Partial<Record<PropertyKey, unknown>>, keys: Partial<Array<unknown>>) => Pick<T, K[number]>;
```

A helper that implements TypeScript’s `Pick` utility type (see also `omit`).

#### Usage Examples

```ts
const obj = { a: 42, b: '42', c: 17 }

expect(pick(obj, ['a', 'b'])).to.deep.equal({ a: 42, b: '42' })
```

### plUral

```ts
const plUral: (singular: string, plural2: string, plural5: string, value: number) => string;
```

A helper for choosing the correct singular and plural.

#### Usage Examples

```ts
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
```

### pro

```ts
const pro: (ref: unknown) => any;
```

A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty
object.

#### Usage Examples

```ts
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
- All other arguments of type `Partial<Record<PropertyKey, unknown>>` are mappings of attributes and properties. Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified. (Note that `$` is not a valid attribute name character.) All other keys specify *attributes* to be set by `setAttributeNS`. An attribute equal to `false` causes the attribute to be removed by `removeAttributeNS`.
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
const uuid1: (date?: Date, node?: string) => string;
```

A helper that generates a UUID v1 identifier (with a creation timestamp).

- The optional `node` parameter should have the format `/^[0123456789abcdef]+$/`. Its value will be trimmed to last 12 characters and left padded with zeros.

#### Usage Examples

```ts
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
```

```ts
expect(uuid1(new Date(), '000123456789abc').split('-')[4]).to.deep.equal('123456789abc')
expect(uuid1(new Date(), '123456789').split('-')[4]).to.deep.equal('000123456789')
```

```ts
expect(uuid1(new Date(323325000000)).startsWith('c1399400-9a71-11bd')).to.be.true
```

## Why Partial\<Array\> and Partial\<Record\>

Consider the following code snippet:

```ts
const arr = ['one', 'two', 'three'] // type: string[]
const arrAt42 = arr[42] // type: string

arrAt42.toUpperCase() // 👎 allowed by TypeScript
```

TypeScript allows `arrAt42.toUpperCase()`,
which causes a <code class="log">TypeError: undefined is not an object</code>.
The variable `arr` should be of type `Partial<Array<string>>`:

```ts
const arr: Partial<Array<string>> = ['one', 'two', 'three']
const arrAt42 = arr[42] // type: string | undefined

arrAt42.toUpperCase()  // 👍 forbidden by TypeScript
```

Now `arrAt42.toUpperCase()` is forbidden by TypeScript (<code class="log">'arrAt42' is possibly undefined</code>).

Similarly for the type `Record`:

```ts
const rec = Object.fromEntries(['one', 'two', 'three'].map((k, i) => [k, i])) // type: Record<string, number>
const { tree } = rec // type: number

tree.toFixed() // 👎 allowed by TypeScript
```

TypeScript allows `tree.toFixed()`, which causes a <code class="log">TypeError: undefined is not an object</code>.
The variable `rec` should be of type `Partial<Record<PropertyKey, number>>`:

```ts
const rec: Partial<Record<PropertyKey, number>> =
  Object.fromEntries(['one', 'two', 'three'].map((k, i) => [k, i]))
const { tree } = rec // type: number | undefined

tree.toFixed() // 👍 forbidden by TypeScript
```

Now `tree.toFixed()` is forbidden by TypeScript (<code class="log">'tree' is possibly undefined</code>).

## License

The MIT License (MIT)

Copyright (c) 2016+ Jackens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
