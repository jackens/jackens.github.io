/**
 * A helper for choosing the correct singular and plural.
 */
export const plUral = (singular: string, plural2: string, plural5: string, value: number) => {
  const absValue = Math.abs(value)
  const absValueMod10 = absValue % 10

  return value === 1
    ? singular
    : (absValueMod10 === 2 || absValueMod10 === 3 || absValueMod10 === 4) &&
      absValue !== 12 && absValue !== 13 && absValue !== 14
        ? plural2
        : plural5
}
