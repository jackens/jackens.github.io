import { expect, test } from 'bun:test'
import { EscapeMap, escape, escapeValues } from '../src/nnn/escape.js'

test('escape', () => {
  // @ts-expect-error
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
})
