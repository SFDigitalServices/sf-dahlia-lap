import validate from 'utils/form/validations'

// Validations will return this message if failed, null if passed
const FAILED_VALIDATION = 'failed validation'

describe('validate', () => {
  describe('isOldEnough', () => {
    test('passes validation if DOB is more than 18 years ago', () => {
      expect(validate.isOldEnough(FAILED_VALIDATION)(['2000', '01', '12'])).toEqual(null)
    })
    test('fails validation if DOB is less than 18 years ago', () => {
      expect(validate.isOldEnough(FAILED_VALIDATION)(['2010', '01', '12'])).toEqual(FAILED_VALIDATION)
    })
  })
  describe('isValidDate', () => {
    test('passes validation if date is valid', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['2000', '02', '29'])).toEqual(null)
    })
    test('fails validation if date is a leap day in the wrong year', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['1999', '02', '29'])).toEqual(FAILED_VALIDATION)
    })
    test('fails validation if date is in the future', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['2020', '01', '12'])).toEqual(FAILED_VALIDATION)
    })
    test('fails validation if date is too far in the past', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['1899', '01', '12'])).toEqual(FAILED_VALIDATION)
    })
    test('fails validation if month and day are swapped', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['2010', '21', '01'])).toEqual(FAILED_VALIDATION)
    })
    test('fails validation if any of the fields are missing', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['', '01', '12'])).toEqual(FAILED_VALIDATION)
      expect(validate.isValidDate(FAILED_VALIDATION)(['2000', '', '12'])).toEqual(FAILED_VALIDATION)
      expect(validate.isValidDate(FAILED_VALIDATION)(['2000', '01', ''])).toEqual(FAILED_VALIDATION)
    })
    test('fails validation if date has non-numerical characters in it', () => {
      expect(validate.isValidDate(FAILED_VALIDATION)(['2010', '01z', '12'])).toEqual(FAILED_VALIDATION)
    })
  })
})
