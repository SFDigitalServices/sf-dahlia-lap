import moment from 'moment'

import validate from 'utils/form/validations'

// Validations will return this message if failed, null if passed
const VALIDATION_MSG = 'failed validation'

describe('validate', () => {
  describe('isOldEnough', () => {
    describe('passes validation if DOB', () => {
      test('is more than 18 years ago', () => {
        expect(validate.isOldEnough(VALIDATION_MSG)(['2000', '01', '12'])).toEqual(null)
      })
    })
    describe('fails validation if DOB', () => {
      test('is less than 18 years ago', () => {
        const recentYear = moment().subtract(10, 'years').year()
        expect(validate.isOldEnough(VALIDATION_MSG)([recentYear, '01', '12'])).toEqual(VALIDATION_MSG)
      })
      test('is not a valid date', () => {
        expect(validate.isOldEnough(VALIDATION_MSG)(['2010', '13', '30'])).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidEmail', () => {
    describe('passes validation if email', () => {
      test('is valid', () => {
        expect(validate.isValidEmail(VALIDATION_MSG)('test.test@test.com.uk')).toEqual(null)
      })
    })
    describe('fails validation if email', () => {
      test('is not a valid email', () => {
        expect(validate.isValidEmail(VALIDATION_MSG)('test.com')).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidDate', () => {
    describe('passes validation', () => {
      test('if date is valid and 0-padded', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', '02', '29'])).toEqual(null)
      })
      test('if date is valid and not 0-padded', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', '2', '9'])).toEqual(null)
      })
      test('if date is valid and values are integers', () => {
        expect(validate.isValidDate(VALIDATION_MSG)([2000, 2, 9])).toEqual(null)
      })
      test('if date is in the future', () => {
        const futureYear = moment().add(1, 'years').year()
        expect(validate.isValidDate(VALIDATION_MSG)([futureYear, '01', '12'])).toEqual(null)
      })
      test('if date is empty', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['', '', ''])).toEqual(null)
      })
    })
    describe('fails validation', () => {
      test('if date is a leap day in the wrong year', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['1999', '02', '29'])).toEqual(VALIDATION_MSG)
      })
      test('if date is too far in the past', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['1899', '01', '12'])).toEqual(VALIDATION_MSG)
      })
      test('if month and day are swapped', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['2010', '21', '01'])).toEqual(VALIDATION_MSG)
      })
      test('if any of the fields are missing', () => {
        // Empty string
        expect(validate.isValidDate(VALIDATION_MSG)(['', '01', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', '', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', '01', ''])).toEqual(VALIDATION_MSG)
        // Null
        expect(validate.isValidDate(VALIDATION_MSG)([null, '01', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', null, '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isValidDate(VALIDATION_MSG)(['2000', '01', null])).toEqual(VALIDATION_MSG)
        // Array of length < 3
        expect(validate.isValidDate(VALIDATION_MSG)(['01', '12'])).toEqual(VALIDATION_MSG)
      })
      test('if date has non-numerical characters in it', () => {
        expect(validate.isValidDate(VALIDATION_MSG)(['2010', '01z', '12'])).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidCurrency', () => {
    describe('passes validation', () => {
      test('when a null or empty string is passed', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)(null)).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('')).toEqual(null)
      })
      test('when a number is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)(2000)).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)(2000.5)).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('2000.5')).toEqual(null)
      })
      test('when a currency string is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2,000')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000.53')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('2,000')).toEqual(null)
      })
      // TODO: Enhance currency validation to exclude these cases.
      test('when any string with $s and ,s is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000$')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2,000,')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$')).toEqual(null)
        expect(validate.isValidCurrency(VALIDATION_MSG)(',')).toEqual(null)
      })
    })
    describe('fails validation', () => {
      test('when a string contains letters is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('zzz')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('2000.5z')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('a130')).toEqual(VALIDATION_MSG)
      })
      test('when a string containing other characters is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('%2000')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2,000;')).toEqual(VALIDATION_MSG)
      })
    })
    describe('passes validation', () => {
      test('when null or empty string is passed', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(null)).toEqual(null)
        expect(validate.isUnderMaxValue('')(VALIDATION_MSG)(null)).toEqual(null)
      })
      test('when a number under the max value is entered', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(9)).toEqual(null)
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(9.99)).toEqual(null)
      })
      test('when a currency string with a value under the max is entered', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$9')).toEqual(null)
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$9.99')).toEqual(null)
      })
    })
    describe('fails validation', () => {
      test('when a float cannot be parsed', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('zzz')).toEqual(VALIDATION_MSG)
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$')).toEqual(VALIDATION_MSG)
      })
      test('when a number is passed with a value greater than the max', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(11)).toEqual(VALIDATION_MSG)
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(10.01)).toEqual(VALIDATION_MSG)
      })
      test('when a currency string is passed with a value greater than the max', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$11')).toEqual(VALIDATION_MSG)
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$10.01')).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isPresent', () => {
    describe('passes validation on ', () => {
      test('a non-empty string', () => {
        expect(validate.isPresent(VALIDATION_MSG)('something')).toEqual(null)
      })
      test('an integer', () => {
        expect(validate.isPresent(VALIDATION_MSG)(9)).toEqual(null)
      })
      test('an array with values in it', () => {
        expect(validate.isPresent(VALIDATION_MSG)(['1', '2', '3'])).toEqual(null)
      })
    })
    describe('fails validation on ', () => {
      test('an empty string', () => {
        expect(validate.isPresent(VALIDATION_MSG)('')).toEqual(VALIDATION_MSG)
      })
      test('null or undefined', () => {
        expect(validate.isPresent(VALIDATION_MSG)(null)).toEqual(VALIDATION_MSG)
        expect(validate.isPresent(VALIDATION_MSG)(undefined)).toEqual(VALIDATION_MSG)
      })
      test('an array of empty values or empty array', () => {
        expect(validate.isPresent(VALIDATION_MSG)(['', '', ''])).toEqual(VALIDATION_MSG)
        expect(validate.isPresent(VALIDATION_MSG)([])).toEqual(VALIDATION_MSG)
      })
    })
  })
})
