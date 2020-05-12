import { getAmiPercent } from 'components/supplemental_application/sections/ConfirmedHouseholdIncome'

jest.mock('apiService', () => ({
  getAMI: async (data) => {
    return { ami: [
      { chartType: data.chartType, year: data.chartYear, amount: 100, numOfHousehold: 1 },
      { chartType: data.chartType, year: data.chartYear, amount: 200, numOfHousehold: 2 },
      { chartType: data.chartType, year: data.chartYear, amount: 300, numOfHousehold: 3 }
    ]}
  }
}))

describe('ConfirmedHouseholdIncome', () => {
  describe('getAmiPercent', () => {
    test('it returns percentage of ami for given income', () => {
      expect(getAmiPercent({'income': 10000, 'ami': '100000'})).toBe('10%')
      expect(getAmiPercent({'income': '10000', 'ami': '100000'})).toBe('10%')
      expect(getAmiPercent({'income': '$10,000', 'ami': '100000'})).toBe('10%')
      expect(getAmiPercent({'income': '$10,000.00', 'ami': '100000'})).toBe('10%')
    })
    test('it returns useful messages if params are missing', () => {
      expect(getAmiPercent({'income': null, 'ami': '100000'})).toBe('Enter HH Income')
      expect(getAmiPercent({'income': '$1,000', 'ami': null})).toBe('Missing AMI Chart')
    })
    test('it returns error message if income is invalid', () => {
      expect(getAmiPercent({'income': 'zzz', 'ami': '100000'})).toBe('Fix HH Income')
    })
  })
})
