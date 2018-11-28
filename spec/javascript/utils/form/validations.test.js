import moment from 'moment'

import validate from 'utils/form/validations'

// Validations will return this message if failed, null if passed
const FAILED_VALIDATION_MSG = 'failed validation'

describe('validate', () => {
  describe('isOldEnough', () => {
    test('passes validation if DOB is more than 18 years ago', () => {
      expect(validate.isOldEnough(FAILED_VALIDATION_MSG)(['2000', '01', '12'])).toEqual(null)
    })
    test('fails validation if DOB is less than 18 years ago', () => {
      const recentYear = moment().subtract(10, 'years').year()
      expect(validate.isOldEnough(FAILED_VALIDATION_MSG)([recentYear, '01', '12'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if DOB is not a valid date', () => {
      expect(validate.isOldEnough(FAILED_VALIDATION_MSG)(['2010', '13', '30'])).toEqual(FAILED_VALIDATION_MSG)
    })
  })
  describe('isValidDate', () => {
    test('passes validation if date is valid and 0-padded', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', '02', '29'])).toEqual(null)
    })
    test('passes validation if date is valid and not 0-padded', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', '2', '9'])).toEqual(null)
    })
    test('passes validation if date is valid and values are integers', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)([2000, 2, 9])).toEqual(null)
    })
    test('fails validation if date is a leap day in the wrong year', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['1999', '02', '29'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if date is in the future', () => {
      const futureYear = moment().add(1, 'years').year()
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)([futureYear, '01', '12'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if date is too far in the past', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['1899', '01', '12'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if month and day are swapped', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2010', '21', '01'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if any of the fields are missing', () => {
      // Empty string
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['', '01', '12'])).toEqual(FAILED_VALIDATION_MSG)
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', '', '12'])).toEqual(FAILED_VALIDATION_MSG)
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', '01', ''])).toEqual(FAILED_VALIDATION_MSG)
      // Null
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)([null, '01', '12'])).toEqual(FAILED_VALIDATION_MSG)
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', null, '12'])).toEqual(FAILED_VALIDATION_MSG)
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2000', '01', null])).toEqual(FAILED_VALIDATION_MSG)
      // Array of length < 3
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['01', '12'])).toEqual(FAILED_VALIDATION_MSG)
    })
    test('fails validation if date has non-numerical characters in it', () => {
      expect(validate.isValidDate(FAILED_VALIDATION_MSG)(['2010', '01z', '12'])).toEqual(FAILED_VALIDATION_MSG)
    })
  })
})
