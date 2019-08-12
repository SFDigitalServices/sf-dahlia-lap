// TODO: Expand these tests to test all fields in application.
import { mapApplication } from '~/components/mappers/soqlToDomain'
import soqlApplication from '../../../fixtures/application'
import { forEach } from 'lodash'

describe('mapApplication', () => {
  test('it should create demographics based on primary applicant values', async () => {
    soqlApplication.Ethnicity = 'Decline to state'
    soqlApplication.Race = 'Decline to state'
    soqlApplication.Gender = 'Decline to state'
    soqlApplication.Gender_Other = 'gender other'
    soqlApplication.Sexual_Orientation = 'Decline to state'
    soqlApplication.Sexual_Orientation_Other = 'sexual orientation other'

    const mappedApplication = mapApplication(soqlApplication)

    const expectedDomainDemographics = {
      'ethnicity': 'Decline to state',
      'gender': 'Decline to state',
      'gender_other': 'gender other',
      'race': 'Decline to state',
      'sexual_orientation': 'Decline to state',
      'sexual_orientation_other': 'sexual orientation other'
    }
    expect(mappedApplication['demographics']).toEqual(expectedDomainDemographics)
  })

  test('it should format currency values', async () => {
    soqlApplication.Annual_Income = 45000
    soqlApplication.Confirmed_Household_Annual_Income = 23456.78
    soqlApplication.HH_Total_Income_with_Assets_Annual = 34567.89
    soqlApplication.Household_Assets = 8.5
    soqlApplication.Total_Monthly_Rent = 1234
    const expectedDomainCurrencyValues = {
      annual_income: '$45,000.00',
      confirmed_household_annual_income: '$23,456.78',
      hh_total_income_with_assets_annual: '$34,567.89',
      household_assets: '$8.50',
      total_monthly_rent: '$1,234.00'
    }

    const mappedApplication = mapApplication(soqlApplication)

    forEach(expectedDomainCurrencyValues, (value, domainFieldName) => {
      expect(mappedApplication[domainFieldName]).toEqual(value)
    })
  })
})
