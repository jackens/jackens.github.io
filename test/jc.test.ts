import { expect, test } from 'bun:test'
import { jc } from '../src/nnn/jc.js'

test('jc: #1', () => {
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
})

test('jc: #2', () => {
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
})

test('jc: #3', () => {
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
})

test('jc: #4', () => {
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
})

test('jc: #5', () => {
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
})

test('jc: #6', () => {
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
})
