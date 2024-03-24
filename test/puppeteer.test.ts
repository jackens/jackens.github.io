import { afterAll, afterEach, beforeEach, expect, test } from 'bun:test'
import puppeteer, { ConsoleMessageLocation, Page } from 'puppeteer'
import { serve } from '../src/serve.js'

const port = 54321
const baseUrl = `http://127.0.0.1:${port}`
const paths = [
  '/cv/',
  '/nnn/chessboard/',
  '/nnn/doc/',
  '/nnn/gantt/',
  '/nnn/rwd/'
]
const server = serve(port)
const browser = await puppeteer.launch({ headless: true })
let errors: (Error | Partial<Array<ConsoleMessageLocation>> | string)[]
let page: Page
// let coverageIndex = 0

beforeEach(async () => {
  errors = []
  page = await browser.newPage()

  // await page.coverage.startJSCoverage()

  page.on('pageerror', error => errors.push(error))
  page.on('console', message => {
    if (message.type() === 'error' && message.text() !== 'Manifest: Line: 1, column: 1, Syntax error.') {
      errors.push(message.text(), message.stackTrace())
    }
  })
})

paths.forEach(path => test(path, async () => {
  await page.goto(`${baseUrl}${path}`, { waitUntil: ['domcontentloaded', 'networkidle0'] })
}))

afterEach(async () => {
  // const coverage = await page.coverage.stopJSCoverage()

  // await page.close()

  // for (const entry of coverage) {
  //   entry.url = entry.url.replace(baseUrl, `file://${import.meta.dir}`)

  //   await Bun.write(`coverage/${++coverageIndex}.json`, JSON.stringify(entry, null, 2))
  // }

  expect(errors).toStrictEqual([])
})

afterAll(async () => {
  await browser.close()
  server.stop()
})
