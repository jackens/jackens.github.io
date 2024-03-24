import { nanolight } from './nanolight.js'

/**
 * A helper for highlighting JavaScript.
 */
export const nanolightJs = nanolight.bind(0,
  /('.*?'|".*?"|`[\s\S]*?`)|(\/\/.*?\n|\/\*[\s\S]*?\*\/)|(any|bigint|break|boolean|case|catch|class|const|continue|debugger|default|delete|do|else|eval|export|extends|false|finally|for|from|function|goto|if|import|in|instanceof|is|keyof|let|NaN|new|number|null|package|return|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|unknown|var|void|while|with|yield)(?!\w)|([<>=.?:&|!^~*/%+-])|(0x[\dabcdef]+|0o[01234567]+|0b[01]+|\d+(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?)|([$\w]+)(?=\()|([$\wąćęłńóśżźĄĆĘŁŃÓŚŻŹ]+)/,
  [
    chunk => chunk,
    chunk => ['span', { class: 'string' }, chunk],
    chunk => ['span', { class: 'comment' }, chunk],
    chunk => ['span', { class: 'keyword' }, chunk],
    chunk => ['span', { class: 'operator' }, chunk],
    chunk => ['span', { class: 'number' }, chunk],
    chunk => ['span', { class: 'function' }, chunk],
    chunk => ['span', { class: 'literal' }, chunk]
  ]
)
