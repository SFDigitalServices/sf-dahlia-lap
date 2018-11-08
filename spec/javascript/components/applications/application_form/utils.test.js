import { parseHouseholdIncome } from '~/components/applications/application_form/utils'

describe('ApplicationEditPage', () => {
  test('it should save correctly', async () => {
    expect(parseHouseholdIncome('10')).toEqual('10')
    expect(parseHouseholdIncome('10.00')).toEqual('10.00')
    expect(parseHouseholdIncome('$10.00')).toEqual('10.00')
    expect(parseHouseholdIncome('$1,000.00')).toEqual('1000.00')
    expect(parseHouseholdIncome('$1000.00')).toEqual('1000.00')
    expect(parseHouseholdIncome('1000.00')).toEqual('1000.00')
    expect(parseHouseholdIncome('1000')).toEqual('1000')
    expect(parseHouseholdIncome('$10,000.00')).toEqual('10000.00')
  })
})
