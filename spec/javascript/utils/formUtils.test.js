import formUtils from '~/utils/formUtils'

describe('formatPrice', () => {
  test('should format small numbers correctly', async () => {
    expect(formUtils.formatPrice('10')).toEqual('$10.00')
  })
  test('should be empty if there is no value', async () => {
    expect(formUtils.formatPrice(undefined)).toBeNull()
    expect(formUtils.formatPrice(null)).toBeNull()
    expect(formUtils.formatPrice('')).toBeNull()
  })
  test('should add comma for values over 1000', async () => {
    expect(formUtils.formatPrice('11000')).toEqual('$11,000.00')
  })
  test('should format 0 correctly', async () => {
    expect(formUtils.formatPrice('0')).toEqual('$0.00')
  })
  test('should not modify currency values that are already formatted', async () => {
    expect(formUtils.formatPrice('$11,000.00')).toEqual('$11,000.00')
  })
  test('should not format invalid currencies', async () => {
    expect(formUtils.formatPrice('0.0.0')).toEqual('0.0.0')
    expect(formUtils.formatPrice('abc')).toEqual('abc')
    expect(formUtils.formatPrice('$$200')).toEqual('$$200')
  })
})

describe('formatPercent', () => {
  test('should format numbers correctly', async () => {
    expect(formUtils.formatPercent('10')).toEqual('10%')
  })

  test('should remove leading zeros', async () => {
    expect(formUtils.formatPercent('010')).toEqual('10%')
    expect(formUtils.formatPercent('001')).toEqual('1%')
    expect(formUtils.formatPercent('00')).toEqual('0%')
  })

  test('should trim trailing zeros', async () => {
    expect(formUtils.formatPercent('1.0')).toEqual('1%')
    expect(formUtils.formatPercent('1.10')).toEqual('1.1%')
    expect(formUtils.formatPercent('1.101')).toEqual('1.101%')
    expect(formUtils.formatPercent('1.010')).toEqual('1.01%')

    // to check for bug that happens if you use .toPrecision() instead of .toFixed()
    expect(formUtils.formatPercent('123456.010')).toEqual('123456.01%')
  })

  test('should trim any digits after the hundredths place', async () => {
    expect(formUtils.formatPercent('1.1')).toEqual('1.1%')
    expect(formUtils.formatPercent('1.11')).toEqual('1.11%')
    expect(formUtils.formatPercent('1.111')).toEqual('1.111%')
    expect(formUtils.formatPercent('1.1111')).toEqual('1.111%')
    expect(formUtils.formatPercent('1.5555')).toEqual('1.556%')
    expect(formUtils.formatPercent('1.9999')).toEqual('2%')
    expect(formUtils.formatPercent('123456.99999')).toEqual('123457%')
  })

  test('should format 0 correctly', async () => {
    expect(formUtils.formatPercent('0')).toEqual('0%')
  })

  test('should not add multiple percent signs', async () => {
    expect(formUtils.formatPercent('2%')).toEqual('2%')
  })

  test('should leave improper values as-is', async () => {
    expect(formUtils.formatPercent('%')).toEqual('%')
    expect(formUtils.formatPercent('abc')).toEqual('abc')
    expect(formUtils.formatPercent('5.5.5%')).toEqual('5.5.5%')
    expect(formUtils.formatPercent('5..5')).toEqual('5..5')
  })
})

describe('scrubEmptyValues', () => {
  describe('when scrubEmptyStrings is false', () => {
    test('does not modify object without any values', async () => {
      expect(formUtils.scrubEmptyValues({})).toEqual({})
    })

    test('does not modify object without any empty values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: 2 })).toEqual({ 1: 2 })
      expect(formUtils.scrubEmptyValues({ 1: 2, 3: 4 })).toEqual({ 1: 2, 3: 4 })
      expect(formUtils.scrubEmptyValues({ a: 'b' })).toEqual({ a: 'b' })
    })

    test('does not modify object with falsy but non empty values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: 0 })).toEqual({ 1: 0 })
      expect(formUtils.scrubEmptyValues({ 1: '' })).toEqual({ 1: '' })
      expect(formUtils.scrubEmptyValues({ 1: 'false' })).toEqual({ 1: 'false' })
    })

    test('removes empty entries', async () => {
      expect(formUtils.scrubEmptyValues({ 1: null })).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: undefined })).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: null, 2: undefined })).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: null, 2: undefined, 3: 'a', 4: '' })).toEqual({
        3: 'a',
        4: ''
      })
    })

    test('does not modify object with empty nested values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: { 2: undefined } })).toEqual({ 1: { 2: undefined } })
    })
  })

  describe('when scrubEmptyStrings is true', () => {
    test('does not modify object without any values', async () => {
      expect(formUtils.scrubEmptyValues({}, true)).toEqual({})
    })

    test('does not modify object without any empty values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: 2 }, true)).toEqual({ 1: 2 })
      expect(formUtils.scrubEmptyValues({ 1: 2, 3: 4 }, true)).toEqual({ 1: 2, 3: 4 })
      expect(formUtils.scrubEmptyValues({ a: 'b' }, true)).toEqual({ a: 'b' })
    })

    test('does not modify object with falsy but non empty values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: 0 }, true)).toEqual({ 1: 0 })
      expect(formUtils.scrubEmptyValues({ 1: 'false' }, true)).toEqual({ 1: 'false' })
    })

    test('removes empty strings as if they were null', async () => {
      expect(formUtils.scrubEmptyValues({ 1: '' }, true)).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: 2, 3: 4, 4: '' }, true)).toEqual({ 1: 2, 3: 4 })
      expect(formUtils.scrubEmptyValues({ 1: null, 2: undefined, 3: 'a', 4: '' }, true)).toEqual({
        3: 'a'
      })
    })

    test('removes empty entries', async () => {
      expect(formUtils.scrubEmptyValues({ 1: null }, true)).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: undefined }, true)).toEqual({})
      expect(formUtils.scrubEmptyValues({ 1: null, 2: undefined }, true)).toEqual({})
    })

    test('does not modify object with empty nested values', async () => {
      expect(formUtils.scrubEmptyValues({ 1: { 2: undefined } }, true)).toEqual({
        1: { 2: undefined }
      })
    })
  })

  describe('toEmptyOption', () => {
    test('converts a label into an empty option with that label', async () => {
      expect(formUtils.toEmptyOption('Label')).toEqual({ value: '', label: 'Label' })
    })
  })
})

describe('formatNumber', () => {
  test('should parse string into int', async () => {
    expect(formUtils.formatNumber('10')).toEqual(10)
    expect(formUtils.formatNumber('0')).toEqual(0)
  })

  test('should return number', async () => {
    expect(formUtils.formatNumber(10)).toEqual(10)
    expect(formUtils.formatNumber(0)).toEqual(0)
  })

  test('should be empty if there is no value', async () => {
    expect(formUtils.formatNumber(undefined)).toBeNull()
    expect(formUtils.formatNumber(null)).toBeNull()
    expect(formUtils.formatNumber('')).toBeNull()
  })

  test('should not format invalid values', async () => {
    expect(formUtils.formatNumber('0.0.0')).toEqual('0.0.0')
    expect(formUtils.formatNumber('abc')).toEqual('abc')
  })
})
