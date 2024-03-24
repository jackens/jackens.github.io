import { expect, test } from 'bun:test'
import { locale } from '../src/nnn/locale.js'

test('locale', () => {
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
})
