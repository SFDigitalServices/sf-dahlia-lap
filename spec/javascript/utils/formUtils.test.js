import formUtils from '~/utils/formUtils'

describe('formatPrice', () => {
  test('should format small numbers correctly', async () => {
    expect(formUtils.formatPrice('10')).toEqual('$10.00')
  })
  test('should be empty if there is no value', async () => {
    expect(formUtils.formatPrice(undefined)).toEqual(null)
    expect(formUtils.formatPrice(null)).toEqual(null)
    expect(formUtils.formatPrice('')).toEqual(null)
  })
  test('should add comma for values over 1000', async () => {
    expect(formUtils.formatPrice('11000')).toEqual('$11,000.00')
  })
  test('should format 0 correctly', async () => {
    expect(formUtils.formatPrice('0')).toEqual('$0.00')
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

  test('should format 0 correctly', async () => {
    expect(formUtils.formatPercent('0')).toEqual('0%')
  })

  test('should not add multiple percent signs', async () => {
    expect(formUtils.formatPercent('2%')).toEqual('2%')
  })

  test('should leave improper values as-is', async () => {
    expect(formUtils.formatPercent('%')).toEqual('%')
    expect(formUtils.formatPercent('abc')).toEqual('abc')
  })

  test('should be empty if there is no value', async () => {
    expect(formUtils.formatPercent(undefined)).toEqual(null)
    expect(formUtils.formatPercent(null)).toEqual(null)
    expect(formUtils.formatPercent('')).toEqual(null)
  })
})
