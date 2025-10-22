import moment from 'moment'

import validate, { convertPercentAndCurrency, convertCurrency } from 'utils/form/validations'

// Validations will return this message if failed, null if passed
const VALIDATION_MSG = 'failed validation'
const DATE_VALIDATION_MSG = 'Please enter a valid date.'
const dateErrorObject = (message) => ({ all: message, day: message, month: message, year: message })

const mockObjectWithValues = (...values) => {
  const mockObject = {}
  for (let i = 0; i < values.length; i++) {
    mockObject[i] = values[i]
  }

  return mockObject
}

describe('validate', () => {
  describe('isValidUrl', () => {
    describe('passes validation', () => {
      test('is valid url', () => {
        expect(validate.isValidUrl(VALIDATION_MSG)('https://www.sf.gov')).toBeUndefined()
      })
    })
    describe('fails validation', () => {
      test('is invalid url', () => {
        expect(validate.isValidUrl(VALIDATION_MSG)('foo')).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isOldEnough', () => {
    describe('passes validation if DOB', () => {
      test('is more than 18 years ago', () => {
        expect(validate.isOldEnough(VALIDATION_MSG)(['2000', '01', '12'])).toBeUndefined()
      })
    })
    describe('fails validation if DOB', () => {
      test('is less than 18 years ago', () => {
        const recentYear = moment().subtract(10, 'years').year()
        expect(validate.isOldEnough(VALIDATION_MSG)([recentYear, '01', '12'])).toEqual(
          VALIDATION_MSG
        )
      })
      test('is not a valid date', () => {
        expect(validate.isOldEnough(VALIDATION_MSG)(['2010', '13', '30'])).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidEmail', () => {
    describe('passes validation if email', () => {
      test('is valid', () => {
        expect(validate.isValidEmail(VALIDATION_MSG)('test.test@test.com.uk')).toBeUndefined()
      })
    })
    describe('fails validation if email', () => {
      test('is not a valid email', () => {
        expect(validate.isValidEmail(VALIDATION_MSG)('test.com')).toEqual(VALIDATION_MSG)
        expect(validate.isValidEmail(VALIDATION_MSG)('test@test.com`')).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isDate', () => {
    describe('passes validation', () => {
      test('if date is valid and 0-padded', () => {
        expect(validate.isDate(VALIDATION_MSG)(['2000', '02', '29'])).toBeUndefined()
      })
      test('if date is valid and not 0-padded', () => {
        expect(validate.isDate(VALIDATION_MSG)(['2000', '2', '9'])).toBeUndefined()
      })
      test('if date is valid and values are integers', () => {
        expect(validate.isDate(VALIDATION_MSG)([2000, 2, 9])).toBeUndefined()
      })
      test('if date is in the future', () => {
        const futureYear = moment().add(1, 'years').year()
        expect(validate.isDate(VALIDATION_MSG)([futureYear, '01', '12'])).toBeUndefined()
      })
      test('if date is empty', () => {
        expect(validate.isDate(VALIDATION_MSG)(['', '', ''])).toBeUndefined()
      })
    })
    describe('fails validation', () => {
      test('if date is a leap day in the wrong year', () => {
        expect(validate.isDate(VALIDATION_MSG)(['1999', '02', '29'])).toEqual(VALIDATION_MSG)
      })
      test('if date is too far in the past', () => {
        expect(validate.isDate(VALIDATION_MSG)(['1899', '01', '12'])).toEqual(VALIDATION_MSG)
      })
      test('if month and day are swapped', () => {
        expect(validate.isDate(VALIDATION_MSG)(['2010', '21', '01'])).toEqual(VALIDATION_MSG)
      })
      test('if any of the fields are missing', () => {
        // Empty string
        expect(validate.isDate(VALIDATION_MSG)(['', '01', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isDate(VALIDATION_MSG)(['2000', '', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isDate(VALIDATION_MSG)(['2000', '01', ''])).toEqual(VALIDATION_MSG)
        // Null
        expect(validate.isDate(VALIDATION_MSG)([null, '01', '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isDate(VALIDATION_MSG)(['2000', null, '12'])).toEqual(VALIDATION_MSG)
        expect(validate.isDate(VALIDATION_MSG)(['2000', '01', null])).toEqual(VALIDATION_MSG)
        // Array of length < 3
        expect(validate.isDate(VALIDATION_MSG)(['01', '12'])).toEqual(VALIDATION_MSG)
      })
      test('if date has non-numerical characters in it', () => {
        expect(validate.isDate(VALIDATION_MSG)(['2010', '01z', '12'])).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isFutureDate', () => {
    describe('passes validation', () => {
      test('if date is in future', () => {
        expect(validate.isFutureDate(VALIDATION_MSG)(['3000', '02', '28'])).toBeUndefined()
      })
    })
    describe('fails validation', () => {
      test('if date is in past', () => {
        expect(validate.isFutureDate(VALIDATION_MSG)(['1999', '02', '29'])).toEqual(VALIDATION_MSG)
      })
      test('if date is today', () => {
        const today = moment()
        expect(
          validate.isFutureDate(VALIDATION_MSG)([today.year(), today.month(), today.day()])
        ).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidPercent', () => {
    describe('passes validation', () => {
      test('when a null or empty string is passed', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)(null)).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('')).toBeUndefined()
      })
      test('when a number is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)(2000)).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)(2)).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('2000')).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('002000')).toBeUndefined()
      })
      test('when a number with a trailing decimal is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('2000.')).toBeUndefined()
      })
      test('when a percent string is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('20%')).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('20.0%')).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('20.%')).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('20.3%')).toBeUndefined()
        expect(validate.isValidPercent(VALIDATION_MSG)('20.12345%')).toBeUndefined()
      })
    })
    describe('fails validation', () => {
      test('when a negative number is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)(-20)).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('-20')).toEqual(VALIDATION_MSG)
      })
      test('when a string containing multiple decimals is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('100.3.4')).toEqual(VALIDATION_MSG)
      })
      test('when a string containing decimals but no digits is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('.')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('.%')).toEqual(VALIDATION_MSG)
      })
      test('when a string containing letters is entered', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('zzz')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('20005z')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('a130')).toEqual(VALIDATION_MSG)
      })
      test('when the percent sign is not at the end of the value', () => {
        expect(validate.isValidPercent(VALIDATION_MSG)('%2000')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('2000%%')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('%2000%')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('20%00')).toEqual(VALIDATION_MSG)
        expect(validate.isValidPercent(VALIDATION_MSG)('%')).toEqual(VALIDATION_MSG)
      })
    })
  })
  describe('isValidCurrency', () => {
    describe('passes validation', () => {
      test('when a null or empty string is passed', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)(null)).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('')).toBeUndefined()
      })
      test('when a number is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)(2000)).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)(2000.5)).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('2000.5')).toBeUndefined()
      })
      test('when a currency string is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000')).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2,000')).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000.53')).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('2,000')).toBeUndefined()
      })
      test('when a currency string with too many commas is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000,')).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000,.52')).toBeUndefined()
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2,0,0,0')).toBeUndefined()
      })
    })
    describe('fails validation', () => {
      test('when a non-currency string with $s and ,s is entered', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)('$2000$')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$$2000')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$')).toEqual(VALIDATION_MSG)
      })
      test('when the value starts with a comma', () => {
        expect(validate.isValidCurrency(VALIDATION_MSG)(',')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)(',,')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)(',1.00')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$,')).toEqual(VALIDATION_MSG)
        expect(validate.isValidCurrency(VALIDATION_MSG)('$,.00')).toEqual(VALIDATION_MSG)
      })
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
  })

  describe('isUnderMaxValue', () => {
    describe('passes validation', () => {
      test('when null or empty string is passed', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(null)).toBeUndefined()
        expect(validate.isUnderMaxValue('')(VALIDATION_MSG)(null)).toBeUndefined()
      })
      test('when a number under the max value is entered', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(9)).toBeUndefined()
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)(9.99)).toBeUndefined()
      })
      test('when a currency string with a value under the max is entered', () => {
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$9')).toBeUndefined()
        expect(validate.isUnderMaxValue(10)(VALIDATION_MSG)('$9.99')).toBeUndefined()
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
    describe('passes validation on', () => {
      test('a non-empty string', () => {
        expect(validate.isPresent(VALIDATION_MSG)('something')).toBeUndefined()
      })
      test('an integer', () => {
        expect(validate.isPresent(VALIDATION_MSG)(9)).toBeUndefined()
      })
      test('an array with values in it', () => {
        expect(validate.isPresent(VALIDATION_MSG)(['1', '2', '3'])).toBeUndefined()
      })
    })
    describe('fails validation on', () => {
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
  describe('isValidDate', () => {
    const error = {}
    describe('fails validation on', () => {
      test('a empty date', () => {
        expect(validate.isValidDate(undefined, error)).toEqual(dateErrorObject(DATE_VALIDATION_MSG))
      })
      test('missing values', () => {
        expect(validate.isValidDate({ year: 1950, month: 10 }, error)).toEqual(
          dateErrorObject(DATE_VALIDATION_MSG)
        )
      })
      test('primary applicant to young', () => {
        expect(
          validate.isValidDate({ year: 2015, month: 10, day: 10 }, error, {
            isPrimaryApplicant: true
          })
        ).toEqual(dateErrorObject('The primary applicant must be 18 years of age or older'))
      })
    })
    describe('passes validation on', () => {
      test('a valid date', () => {
        expect(validate.isValidDate({ year: 1990, month: 10, day: 1 }, error)).toEqual(
          dateErrorObject(undefined)
        )
      })

      test('a valid date and primary applicant is old enough', () => {
        expect(
          validate.isValidDate({ year: 1950, month: 10, day: 1 }, error, {
            isPrimaryApplicant: true
          })
        ).toEqual(dateErrorObject(undefined))
      })
    })
  })
  describe('convertCurrency', () => {
    describe('does not modify values on', () => {
      test('plain numbers', () => {
        expect(convertCurrency(mockObjectWithValues(10, 20, 30))).toEqual(
          mockObjectWithValues(10, 20, 30)
        )
        expect(convertCurrency(mockObjectWithValues('10', '20', '30'))).toEqual(
          mockObjectWithValues('10', '20', '30')
        )
      })
      test('non-currency or percent strings', () => {
        expect(convertCurrency(mockObjectWithValues('abc', 'def', 'ghi'))).toEqual(
          mockObjectWithValues('abc', 'def', 'ghi')
        )
        expect(convertCurrency(mockObjectWithValues('12%3', 'ab$', '%ab'))).toEqual(
          mockObjectWithValues('12%3', 'ab$', '%ab')
        )
      })
      test('empty values', () => {
        expect(convertCurrency(mockObjectWithValues(null, undefined, '', 0))).toEqual(
          mockObjectWithValues(null, undefined, '', 0)
        )
      })
      test('any non-currency string that starts with $', () => {
        expect(convertCurrency(mockObjectWithValues('$abc'))).toEqual(mockObjectWithValues('$abc'))
      })
      test('any non-percent string that ends with %', () => {
        expect(convertCurrency(mockObjectWithValues('abc%'))).toEqual(mockObjectWithValues('abc%'))
      })
    })
    describe('modifies currency values on', () => {
      test('object that is only currency strings', () => {
        expect(convertCurrency(mockObjectWithValues('$100'))).toEqual(mockObjectWithValues(100))
        expect(convertCurrency(mockObjectWithValues('$100', '$200'))).toEqual(
          mockObjectWithValues(100, 200)
        )
        expect(convertCurrency(mockObjectWithValues('$100.01'))).toEqual(
          mockObjectWithValues(100.01)
        )
        expect(convertCurrency(mockObjectWithValues('$100.0100'))).toEqual(
          mockObjectWithValues(100.01)
        )
      })
      test('object that is currency and non currency strings', () => {
        expect(convertCurrency(mockObjectWithValues('$100', '$200a'))).toEqual(
          mockObjectWithValues(100, '$200a')
        )
        expect(convertCurrency(mockObjectWithValues('abc', '$200'))).toEqual(
          mockObjectWithValues('abc', 200)
        )
        expect(convertCurrency(mockObjectWithValues('100%', '$200'))).toEqual(
          mockObjectWithValues('100%', 200)
        )
      })
    })
  })
  describe('convertPercentAndCurrency', () => {
    describe('does not modify values on', () => {
      test('plain numbers', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues(10, 20, 30))).toEqual(
          mockObjectWithValues(10, 20, 30)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('10', '20', '30'))).toEqual(
          mockObjectWithValues('10', '20', '30')
        )
      })
      test('non-currency or percent strings', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('abc', 'def', 'ghi'))).toEqual(
          mockObjectWithValues('abc', 'def', 'ghi')
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('12%3', 'ab$', '%ab'))).toEqual(
          mockObjectWithValues('12%3', 'ab$', '%ab')
        )
      })
      test('empty values', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues(null, undefined, '', 0))).toEqual(
          mockObjectWithValues(null, undefined, '', 0)
        )
      })
      test('any non-currency string that starts with $', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('$abc'))).toEqual(
          mockObjectWithValues('$abc')
        )
      })
      test('any non-percent string that ends with %', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('abc%'))).toEqual(
          mockObjectWithValues('abc%')
        )
      })
    })
    describe('modifies currency values on', () => {
      test('object that is only currency strings', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('$100'))).toEqual(
          mockObjectWithValues(100)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('$100', '$200'))).toEqual(
          mockObjectWithValues(100, 200)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('$100.01'))).toEqual(
          mockObjectWithValues(100.01)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('$100.0100'))).toEqual(
          mockObjectWithValues(100.01)
        )
      })
      test('object that is currency and non currency strings', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('$100', '$200a'))).toEqual(
          mockObjectWithValues(100, '$200a')
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('abc', '$200'))).toEqual(
          mockObjectWithValues('abc', 200)
        )
      })
    })
    describe('modifies percent values on', () => {
      test('object that is only percent strings', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('100%'))).toEqual(
          mockObjectWithValues(100)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('100.00%', '200.5%'))).toEqual(
          mockObjectWithValues(100, 200.5)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('0%'))).toEqual(
          mockObjectWithValues(0)
        )
      })
      test('object that is percent and non percent strings', () => {
        expect(
          convertPercentAndCurrency(mockObjectWithValues('100%', 'abc', 'abc%', null))
        ).toEqual(mockObjectWithValues(100, 'abc', 'abc%', null))
      })
    })
    describe('modifies percent and currency values on', () => {
      test('object that is only percent and currency strings', () => {
        expect(convertPercentAndCurrency(mockObjectWithValues('$105', '100%'))).toEqual(
          mockObjectWithValues(105, 100)
        )
        expect(convertPercentAndCurrency(mockObjectWithValues('100%', '$105'))).toEqual(
          mockObjectWithValues(100, 105)
        )
      })
      test('object that is percent, currency, and non percent or currency strings', () => {
        expect(
          convertPercentAndCurrency(mockObjectWithValues('100%', '$105', 'abc', 'abc%', '0%'))
        ).toEqual(mockObjectWithValues(100, 105, 'abc', 'abc%', 0))
      })
    })
  })
})
