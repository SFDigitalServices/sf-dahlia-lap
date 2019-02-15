import { currencyToFloat } from '~/utils/utils'

describe('currencyToFloat', () => {
  test('should parse currency values as expected', async () => {
    expect(currencyToFloat('1000')).toEqual(1000)
    expect(currencyToFloat('1000.00')).toEqual(1000.00)
    expect(currencyToFloat('$1000.00')).toEqual(1000.00)
    expect(currencyToFloat('$1,000.00')).toEqual(1000.00)
  })
})
