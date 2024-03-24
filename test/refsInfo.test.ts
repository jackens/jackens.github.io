import { expect, test } from 'bun:test'
import { refsInfo } from '../src/nnn/refsInfo.js'

test('refsInfo', () => {
  const info = refsInfo(Array, Function)

  expect(info.find(([name]) => name === 'Array')?.[2]?.includes('length')).toBeTrue()
  expect(info.find(([name]) => name === 'Function')?.[2]?.includes('length')).toBeTrue()
})

test('refsInfo: browserFingerprint', () => {
  const browserFingerprint = () => {
    // @ts-expect-error
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
})
