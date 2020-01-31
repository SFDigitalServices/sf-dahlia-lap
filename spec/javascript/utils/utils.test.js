import { convertCurrency } from '~/utils/form/validations'

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
    expect(updatedFormValues.applicant.annual_income).toEqual(25000.00)
    expect(updatedFormValues.lease.monthly_rent).toEqual(598.65)
    expect(updatedFormValues.lease.another_nested_level.additional_rent).toEqual(425.99)
  })
})
