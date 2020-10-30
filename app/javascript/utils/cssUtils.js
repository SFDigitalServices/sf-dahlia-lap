export const toRem = (val) => {
  const valString = `${val}`
  const stringSplitByRem = valString.split('rem')

  // catches cases like "1rem2"
  if (stringSplitByRem.length > 1 && stringSplitByRem[1] !== '') {
    return null
  }

  const valStringWithoutRem = stringSplitByRem[0]

  // need to check isNaN(parseInt(valStringWithoutRem)) because isNaN(empty string)
  // returns false but parses to NaN
  if (isNaN(valStringWithoutRem) || isNaN(parseInt(valStringWithoutRem))) {
    return null
  }

  return `${valStringWithoutRem}rem`
}
