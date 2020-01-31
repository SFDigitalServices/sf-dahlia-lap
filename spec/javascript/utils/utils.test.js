import { currencyToFloat } from '~/utils/utils'
import { convertCurrency } from '~/utils/form/validations'

describe('currencyToFloat', () => {
  test('should parse currency values as expected', async () => {
    expect(currencyToFloat(1000)).toEqual(1000)
    expect(currencyToFloat('1000')).toEqual(1000)
    expect(currencyToFloat('1000.00')).toEqual(1000.00)
    expect(currencyToFloat('$1000.00')).toEqual(1000.00)
    expect(currencyToFloat('$1,000.00')).toEqual(1000.00)
    expect(currencyToFloat(null)).toEqual(null)
    expect(currencyToFloat(undefined)).toEqual(null)
    expect(currencyToFloat('')).toEqual(null)
    expect(currencyToFloat(0)).toEqual(0)
  })
})

const defaultFormObject = {
  applicant: {
    applicant_name: 'Name',
    annual_income: '$25,000.00'
  },
  lease: {
    monthly_rent: '$598.65',
    another_nested_level: {
      additional_rent: '$425.99'
    }
  }
}

describe('convertCurrency', () => {
  test('should convert currency values to float from form object', async () => {
    const updatedFormValues = convertCurrency(defaultFormObject)
    console.log(updatedFormValues)
    console.log(typeof updatedFormValues.applicant.annual_income)
    expect(updatedFormValues.applicant.annual_income).toEqual(25000.00)
    expect(updatedFormValues.lease.monthly_rent).toEqual(598.65)
    expect(updatedFormValues.lease.another_nested_level.additional_rent).toEqual(425.99)
  })
})
