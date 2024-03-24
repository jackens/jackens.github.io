import { readFile, readdir, writeFile } from 'fs/promises'

const PATH_D_TS = 'd.ts/src/nnn'
const PATH_TEST_JS = 'test'
const PATH_DIST = 'dist'

const packageJson = JSON.parse(await readFile(`${PATH_DIST}/package.json`, 'utf8'))

type Doc = {
  raw?: string
  type?: Partial<Array<string>>
  desc?: string
  usageExamples?: Partial<Array<string>>
}

const docByName: Partial<Record<PropertyKey, Doc>> = {}

for (const entry of await readdir(PATH_D_TS, { withFileTypes: true })) {
  if (entry.name !== 'nnn.d.ts' && entry.name.endsWith('.d.ts') && entry.isFile()) {
    const code = (await readFile(`${PATH_D_TS}/${entry.name}`, 'utf8'))
      .replaceAll("import { HArgs1 } from './h.js';\n", '')
      .replaceAll('import("./h.js").', '')

    const name = entry.name.replace(/\.d\.ts$/, '')
    const doc = docByName[name] = docByName[name] ?? {}

    doc.raw = code

    code.split(/(\/\*\*[\s\S]*?\*\/\n)?export (?:declare )?(const|function|type) (\w+)/).forEach((chunk, c, chunks) => {
      if ((c % 4) === 3) {
        const name2 = chunk
        const doc2 = docByName[name2] = docByName[name2] ?? {}

        if (chunks[c - 2] != null) {
          doc2.desc = chunks[c - 2].trim().split('\n').slice(1, -1)
            .map(line => line.replace(/^ \* ?/, ''))
            .join('\n')
        }

        doc2.type = doc2.type ?? []
        doc2.type.push(chunks[c - 1] + ' ' + chunk + chunks[c + 1].trimEnd())
      }
    })
  }
}

for (const entry of await readdir(PATH_TEST_JS, { withFileTypes: true })) {
  if (entry.name.endsWith('.test.ts') && entry.isFile()) {
    const code = await readFile(`${PATH_TEST_JS}/${entry.name}`, 'utf8')

    code.replace(/test\('(.+?)', \(\) => \{([\s\S]*?)\n\}\)\n/g,
      (_, name: string, test: string) => {
        name = name.split(':')[0]
        const nnn = docByName[name] = docByName[name] ?? {}

        nnn.usageExamples = nnn.usageExamples ?? []
        nnn.usageExamples.push(test.toString().trim()
          .split('\n')
          .map(line => line.replace(/^ {2}/, ''))
          .filter(line => line.match(/\/\/ (@ts|eslint)-/) == null)
          .join('\n'))

        return ''
      })
  }
}

delete docByName.tests

await writeFile(`${PATH_DIST}/nnn.d.ts`, Object.keys(docByName).sort()
  .filter(name => docByName[name]?.raw != null)
  .map(name => docByName[name]?.raw).join('\n')
  .replaceAll('\n/**\n', '\n\n/**\n')
  .replace(/\n{3,}/g, '\n\n'))

await writeFile(`${PATH_DIST}/readme.md`, `# nnn

${packageJson.description}

<sub>Version: <code class="version">${packageJson.version}</code></sub>

## Examples

- [Chessboard Demo](https://jackens.github.io/nnn/chessboard/)
- [Documentation](https://jackens.github.io/nnn/doc/)
- [Gant Chart Demo](https://jackens.github.io/nnn/gantt/)
- [Responsive Web Design Demo](https://jackens.github.io/nnn/rwd/)

## Installation

\`\`\`sh
bun i @jackens/nnn
\`\`\`

or

\`\`\`sh
npm i @jackens/nnn
\`\`\`

## Usage

Bun (or Node.js):

\`\`\`js
import { «something» } from '@jackens/nnn'
\`\`\`

The browser (or Bun or Node.js):

\`\`\`js
import { «something» } from './node_modules/@jackens/nnn/nnn.js'
\`\`\`

## Exports

${Object.keys(docByName).sort().map(name => `
- \`${name}\`: ${docByName?.[name]?.desc?.split('\n')[0]}
`.trim()).join('\n')}

${Object.keys(docByName).sort().map(name => `
### ${name}

\`\`\`ts
${docByName?.[name]?.type?.join('\n')}
\`\`\`

${docByName?.[name]?.desc ?? ''}

${docByName?.[name]?.usageExamples != null
? `
#### Usage Examples
`
: ''}

${docByName?.[name]?.usageExamples?.map(code => `
\`\`\`js
${code}
\`\`\`
`).join('\n\n') ?? ''}
`).join('\n\n')}

## License

The MIT License (MIT)

Copyright (c) 2016+ Jackens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`.replace(/\n{2,}/g, '\n\n'))
