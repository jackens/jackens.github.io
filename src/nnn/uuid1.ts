const ZEROS = '0'.repeat(16)
let counter = 0

/**
 * A helper that generates a UUID v1 identifier (with a creation timestamp).
 *
 * - The optional `node` parameter should have the format `/^[0123456789abcdef]+$/`.
 *   Its value will be trimmed to last 12 characters and left padded with zeros.
 */
export const uuid1 = ({
  date = new Date(),
  node = Math.random().toString(16).slice(2)
} = {}) => {
  const time = ZEROS + (10000 * (+date + 12219292800000)).toString(16)

  counter = (counter + 1) & 16383

  return time.slice(-8).concat(
    '-',
    time.slice(-12, -8),
    // @ts-expect-error
    -1,
    time.slice(-15, -12),
    '-',
    (8 | (counter >> 12)).toString(16),
    (ZEROS + (counter & 4095).toString(16)).slice(-3),
    '-',
    (ZEROS + node).slice(-12))
}
