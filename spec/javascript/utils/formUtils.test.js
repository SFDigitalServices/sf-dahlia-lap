import formUtils from '~/utils/formUtils'

describe('formatPrice', () => {
  test('should format small numers correctly', async () => {
    expect(formUtils.formatPrice('10')).toEqual('$10.00')
  })
  test('should be empty if there is no value', async () => {
    expect(formUtils.formatPrice(undefined)).toEqual('')
    expect(formUtils.formatPrice(null)).toEqual('')
    expect(formUtils.formatPrice('')).toEqual('')
  })
  test('should add comma for values over 1000', async () => {
    expect(formUtils.formatPrice('11000')).toEqual('$11,000.00')
  })
})
