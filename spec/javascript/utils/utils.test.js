import { convertCurrency } from '~/utils/form/validations'
import { filterChanged } from '~utils/utils'
import { cloneDeep } from 'lodash'

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

const object = {
  id: 'abcd',
  number: 1,
  string: 'str',
  object: {
    id: 'abc',
    number: 1,
    string: 'str'
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

describe('filterChanged', () => {
  test('should filter only changed fields with id', async () => {
    const changedObject = cloneDeep(object)
    changedObject.number = 2
    changedObject.object.string = 'rts'
    changedObject.newField = 'value'
    changedObject.object.newField = 'value'
    const diff = filterChanged(object, changedObject)
    expect(diff).toEqual({
      id: 'abcd',
      number: 2,
      newField: 'value',
      object: {
        id: 'abc',
        string: 'rts',
        newField: 'value'
      }
    })
  })

  test('should return only id if object is not changed', async () => {
    const changedObject = cloneDeep(object)
    const diff = filterChanged(object, changedObject)
    expect(diff).toEqual({id: 'abcd'})
  })
})
