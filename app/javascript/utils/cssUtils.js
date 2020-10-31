const addUnitToNumber = (val, unitSuffix) => {
  const valString = `${val}`.toLowerCase()
  const stringSplitBySuffix = valString.split(unitSuffix)

  // catches cases like "1rem2"
  if (stringSplitBySuffix.length > 1 && stringSplitBySuffix[1] !== '') {
    return null
  }

  const valStringWithoutSuffix = stringSplitBySuffix[0]

  // need to check isNaN(parseInt(valStringWithoutRem)) because isNaN(empty string)
  // returns false but parses to NaN
  if (isNaN(valStringWithoutSuffix) || isNaN(parseInt(valStringWithoutSuffix))) {
    return null
  }

  return `${valStringWithoutSuffix}${unitSuffix}`
}

export const toRem = (val) => addUnitToNumber(val, 'rem')

export const toPx = (val) => addUnitToNumber(val, 'px')
