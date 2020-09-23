import { formatValue } from 'utils/fieldSpecs'

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
      expect(formatValue('notADate', 'string')).toEqual('notADate')
    })
  })
})
