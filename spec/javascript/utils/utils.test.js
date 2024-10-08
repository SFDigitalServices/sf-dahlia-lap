import { cloneDeep } from 'lodash'

import { convertCurrency } from 'utils/form/validations'
import { filterChanged, isChanged, isDateObject } from 'utils/utils'

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

describe('isChanged', () => {
  test('should return false when both objects are equal', () => {
    expect(isChanged(undefined, undefined)).toBeFalsy()
    expect(isChanged(null, null)).toBeFalsy()
    expect(isChanged({}, {})).toBeFalsy()
    expect(isChanged({ a: 'a' }, { a: 'a' })).toBeFalsy()
    expect(isChanged({ a: { b: 'b' } }, { a: { b: 'b' } })).toBeFalsy()
    expect(isChanged({ a: [{ b: 'b' }] }, { a: [{ b: 'b' }] })).toBeFalsy()
  })

  test('should return true when both objects are unequal', () => {
    expect(isChanged(null, undefined)).toBeTruthy()
    expect(isChanged(undefined, {})).toBeTruthy()
    expect(isChanged(null, {})).toBeTruthy()
    expect(isChanged({ a: 'a' }, {})).toBeTruthy()
    expect(isChanged({ a: 'a' }, { a: 'b' })).toBeTruthy()
    expect(isChanged({ a: 'a' }, { b: 'a' })).toBeTruthy()
    expect(isChanged({ a: { b: 'b' } }, { a: { b: 'a' } })).toBeTruthy()
    expect(isChanged({ a: [{ b: 'b' }] }, { a: [{ b: 'a' }] })).toBeTruthy()
  })
})

describe('convertCurrency', () => {
  test('should convert currency values to float from form object', async () => {
    const updatedFormValues = convertCurrency(defaultFormObject)
    expect(updatedFormValues.applicant.annual_income).toBe(25000.0)
    expect(updatedFormValues.lease.monthly_rent).toBe(598.65)
    expect(updatedFormValues.lease.another_nested_level.additional_rent).toBe(425.99)
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
    expect(diff).toEqual({ id: 'abcd' })
  })

  test('should update id', async () => {
    const prevApp = {
      id: 'appid',
      primary_applicant: {
        id: 'primary1',
        name: 'joe'
      }
    }

    const newApp = {
      id: 'appid',
      primary_applicant: {
        id: 'primary2',
        name: 'james'
      }
    }

    const expectedFilteredApp = {
      id: 'appid',
      primary_applicant: {
        id: 'primary2',
        name: 'james'
      }
    }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should include changed array', async () => {
    const prevApp = {
      id: 'appid',
      applicant_contacts: [
        {
          id: 'contact1',
          name: 'joe'
        },
        {
          id: 'contact2',
          name: 'james'
        }
      ],
      applicant_contacts_unchanged: [
        {
          id: 'contact1',
          name: 'joe'
        },
        {
          id: 'contact2',
          name: 'james'
        }
      ],
      other_changed_list: [1, 2, 3],
      other_unchanged_list: [1, 2, 3]
    }

    const newApp = {
      id: 'appid',
      applicant_contacts: [
        {
          id: 'contact3',
          name: 'chris'
        },
        {
          id: 'contact4',
          name: 'amy'
        }
      ],
      applicant_contacts_unchanged: [
        {
          id: 'contact1',
          name: 'joe'
        },
        {
          id: 'contact2',
          name: 'james'
        }
      ],
      other_changed_list: [1, 2, 3, 4],
      other_unchanged_list: [1, 2, 3]
    }

    const expectedFilteredApp = {
      id: 'appid',
      applicant_contacts: [
        {
          id: 'contact3',
          name: 'chris'
        },
        {
          id: 'contact4',
          name: 'amy'
        }
      ],
      other_changed_list: [1, 2, 3, 4]
    }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should work with empty objects', async () => {
    const prevApp = {}
    const newApp = {}
    const expectedFilteredApp = {}
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should handle object without id and no changes', async () => {
    const prevApp = { a: '1' }
    const newApp = { a: '1' }
    const expectedFilteredApp = {}
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should handle object without id and with changes', async () => {
    const prevApp = { a: '1' }
    const newApp = { a: '2' }
    const expectedFilteredApp = { a: '2' }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should handle nested object without changes', async () => {
    const prevApp = { id: 'abc', a: '1', b: { id: 'abcd', c: '2' } }
    const newApp = { id: 'abc', a: '2', b: { id: 'abcd', c: '2' } }
    const expectedFilteredApp = { id: 'abc', a: '2' }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should handle nested object with changes', async () => {
    const prevApp = { id: 'abc', a: '1', b: { id: 'abcd', c: '2' } }
    const newApp = { id: 'abc', a: '1', b: { id: 'abcd', c: '3' } }
    const expectedFilteredApp = { id: 'abc', b: { id: 'abcd', c: '3' } }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should pass the whole date object', async () => {
    const prevApp = { id: 'abc', date: { day: '01', month: '01', year: '2021' } }
    const newApp = { id: 'abc', date: { day: '01', month: '02', year: '2021' } }
    const expectedFilteredApp = { id: 'abc', date: { day: '01', month: '02', year: '2021' } }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should not return unchanged date', async () => {
    const prevApp = { id: 'abc', a: '1', b: { day: '01', month: '01', year: '2021' } }
    const newApp = { id: 'abc', a: '1', b: { day: '01', month: '01', year: '2021' } }
    const expectedFilteredApp = { id: 'abc' }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should pass all ada priority fields', async () => {
    const prevApp = {
      id: 'abc',
      a: '1',
      has_ada_priorities_selected: { mobility_impairments: true }
    }
    const newApp = {
      id: 'abc',
      a: '1',
      has_ada_priorities_selected: { mobility_impairments: true, vision_impairments: true }
    }
    const expectedFilteredApp = {
      id: 'abc',
      has_ada_priorities_selected: { mobility_impairments: true, vision_impairments: true }
    }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })

  test('should set removed field to null', async () => {
    const prevApp = { id: 'abc', a: '1', b: { day: '01', month: '01', year: '2021' } }
    const newApp = { id: 'abc', a: '1' }
    const expectedFilteredApp = { id: 'abc', b: null }
    const diff = filterChanged(prevApp, newApp)
    expect(diff).toEqual(expectedFilteredApp)
  })
})

describe('isDateObject', () => {
  test('should return true for date object', async () => {
    const object = { month: '01', day: '01', year: '2021' }
    expect(isDateObject(object)).toBeTruthy()
  })

  test('should return false for date object with extra keys', async () => {
    const object = { month: '01', day: '01', year: '2021', a: '12' }
    expect(isDateObject(object)).toBeFalsy()
  })

  test('should return false for date object with missing key', async () => {
    const object = { month: '01', day: '01', a: '12' }
    expect(isDateObject(object)).toBeFalsy()
  })
})
