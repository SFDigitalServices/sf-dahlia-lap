// TODO: Expand these tests to use fixtures, test all fields in application.
import domainToApi from '~/components/mappers/domainToApi'
import { cloneDeep } from 'lodash'

const domainApplication = {
  'id': 'application_id',
  'listing': {
    'name': 'Test 5/30',
    'id': 'listing_id'
  },
  'applicant': {
    'id': 'applicant_id',
    'city': 'Berkeley',
    'date_of_birth': {year: '1920', month: '1', day: '1'},
    'email': 'test@test.com',
    'first_name': 'First',
    'last_name': 'Last',
    'middle_name': 'middle',
    'phone': '8675309',
    'phone_type': 'Cell',
    'state': 'CA',
    'street': '123 candy lane',
    'zip_code': '94703',
    'mailing_city': 'San Francisco',
    'mailing_state': 'CA',
    'mailing_street': '123 mailing address ln',
    'mailing_zip_code': '01450'
  },
  'demographics': {
    'ethnicity': 'Hispanic/Latino',
    'gender': 'Not Listed',
    'gender_other': 'other gender',
    'race': 'Black/African American',
    'sexual_orientation': 'Not listed',
    'sexual_orientation_other': 'other orientation'
  },
  'alternate_contact': {
    'first_name': 'Alt',
    'last_name': 'Contact',
    'middle_name': 'middle name',
    'alternate_contact_type': 'contact type',
    'alternate_contact_type_other': 'contact type other',
    'agency_name': 'agency name',
    'email': 'email',
    'phone': 'phone',
    'phone_type': 'phone type',
    'mailing_street': 'mailing address',
    'mailing_city': 'mailing city',
    'mailing_state': 'mailing state',
    'mailing_zip_code': 'mailing zip'
  }
}

describe('buildApplicationShape', () => {
  test('it should build primary applicant with expected API keys', async () => {
    // Primary applicant section should include demographic information
    const mappedApplication = domainToApi.buildApplicationShape(domainApplication)
    const mappedPrimaryApplicant = mappedApplication['primaryApplicant']

    const expectedPrimaryApplicant = {
      'DOB': '1920-01-01',
      'address': '123 candy lane',
      'appMemberId': 'applicant_id',
      'city': 'Berkeley',
      'email': 'test@test.com',
      'ethnicity': 'Hispanic/Latino',
      'firstName': 'First',
      'gender': 'Not Listed',
      'genderOther': 'other gender',
      'lastName': 'Last',
      'mailingAddress': '123 mailing address ln',
      'mailingCity': 'San Francisco',
      'mailingState': 'CA',
      'mailingZip': '01450',
      'maritalStatus': undefined,
      'middleName': 'middle',
      'phone': '8675309',
      'phoneType': 'Cell',
      'race': 'Black/African American',
      'sexualOrientation': 'Not listed',
      'sexualOrientationOther': 'other orientation',
      'state': 'CA',
      'zip': '94703'
    }
    expect(mappedPrimaryApplicant).toEqual(expectedPrimaryApplicant)
  })

  test('it should map alternate contacts as expected', () => {
    const mappedApplication = domainToApi.buildApplicationShape(domainApplication)

    const expectedAlternateContact = {
      'firstName': 'Alt',
      'lastName': 'Contact',
      'agency': 'agency name',
      'alternateContactType': 'contact type',
      'alternateContactTypeOther': 'contact type other',
      'email': 'email',
      'mailingAddress': 'mailing address',
      'mailingCity': 'mailing city',
      'mailingState': 'mailing state',
      'mailingZip': 'mailing zip',
      'middleName': 'middle name',
      'phone': 'phone',
      'phoneType': 'phone type'
    }

    expect(mappedApplication['alternateContact']).toEqual(expectedAlternateContact)
  })

  test('it should remove alternate contact if all fields are empty', () => {
    const mockDomainApp = cloneDeep(domainApplication)
    mockDomainApp['alternate_contact'] = { 'middle_name': '', 'first_name': null }
    const mappedApplication = domainToApi.buildApplicationShape(mockDomainApp)
    expect(mappedApplication).not.toHaveProperty(['alternateContact'])
  })
})
