import { formatValue, getFormatType } from 'utils/fieldSpecs'

describe('formatValue', () => {
  describe('formats dates that are strings from salesforce', () => {
    test('it should return attachment url if attachment', () => {
      const dateString = '1990-01-24'
      const expectedDate = '01/24/1990'
      expect(formatValue(dateString, 'date')).toEqual(expectedDate)
    })
    test('formats dates that are objects', () => {
      const dateObject = { month: '1', day: '24', year: '1990' }
      const expectedDate = '01/24/1990'
      expect(formatValue(dateObject, 'date')).toEqual(expectedDate)
    })
    test('does not format non-date values', () => {
      expect(formatValue('notADate', 'string')).toBe('notADate')
    })
  })
})

describe('getFormatType', () => {
  test('returns phone for phone number fields', () => {
    expect(getFormatType('phone')).toBe('phone')
    expect(getFormatType('second_phone')).toBe('phone')
  })
  test('does not return phone for phone type fields', () => {
    expect(getFormatType('phone_type')).toBeNull()
    expect(getFormatType('second_phone_type')).toBeNull()
  })
})

describe('formatValue with phone type', () => {
  test('adds hyphens to unformatted phone numbers', () => {
    expect(formatValue('4155551234', 'phone')).toBe('415-555-1234')
  })
})
