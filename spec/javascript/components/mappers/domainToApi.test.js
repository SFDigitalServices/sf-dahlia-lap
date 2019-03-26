// TODO: Expand these tests to use fixtures, test all fields in application.
import domainToApi from '~/components/mappers/domainToApi'

const domainApplication = {
  'id': 'application_id',
  'listing': {
    'name': 'Test 5/30',
    'id': 'listing_id'
  },
  'applicant': {
    'id': 'applicant_id',
    'city': 'Berkeley',
    'date_of_birth': ['1920', '1', '1'],
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
})
