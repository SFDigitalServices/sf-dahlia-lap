// TODO: Expand these tests to test all fields in application.
import soqlApplication from '../../../fixtures/application'
import { forEach, cloneDeep } from 'lodash'

describe('mapApplication', () => {
  test('it should create demographics based on primary applicant values', async () => {
    soqlApplication.Ethnicity = 'Decline to state'
    soqlApplication.Race = 'Decline to state'
    soqlApplication.Gender = 'Decline to state'
    soqlApplication.Gender_Other = 'gender other'
    soqlApplication.Sexual_Orientation = 'Decline to state'
    soqlApplication.Sexual_Orientation_Other = 'sexual orientation other'

    const mappedApplication = soqlApplication

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
      annual_income: 45000,
      confirmed_household_annual_income: 23456.78,
      hh_total_income_with_assets_annual: 34567.89,
      household_assets: 8.50,
      total_monthly_rent: 1234.00
    }

    const mappedApplication = soqlApplication

    forEach(expectedDomainCurrencyValues, (value, domainFieldName) => {
      expect(mappedApplication[domainFieldName]).toEqual(value)
    })
  })

  test('it maps alternate contact as expected', () => {
    const mockSoqlApplication = cloneDeep(soqlApplication)

    // Expect that alternate contact does not include id
    const expectedAlternateContact = {
      'first_name': 'Federic',
      'middle_name': 'Daaaa',
      'last_name': 'dayan',
      'phone_type': 'Cell',
      'phone': '9954449943',
      'email': 'fede@eee.com',
      'agency_name': null,
      'alternate_contact_type': 'Friend',
      'alternate_contact_type_other': null,
      'mailing_address': '123 Alternate Mailing St, SF Mailing, CA, 94105-1804',
      'mailing_street': '123 Alternate Mailing St',
      'mailing_city': 'SF Mailing',
      'mailing_state': 'CA',
      'mailing_zip_code': '94105-1804',
      // Fields below are automatically added by application member mapping, are not used
      'primary_language': undefined,
      'relationship_to_applicant': undefined,
      'residence_address': undefined,
      'second_phone': undefined,
      'second_phone_type': undefined,
      'state': undefined,
      'street': undefined,
      'zip_code': undefined,
      'city': undefined,
      'date_of_birth': null,
      'marital_status': undefined,
      'name': undefined
    }

    const mappedApplication = mockSoqlApplication
    expect(mappedApplication['alternate_contact']).toEqual(expectedAlternateContact)
  })
})
