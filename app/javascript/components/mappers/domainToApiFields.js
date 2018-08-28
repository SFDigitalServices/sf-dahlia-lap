import { shapeMapper, listMapper } from '~/utils/objectUtils'

export const applicantFieldMapper = {
  date_of_birth: 'DOB',
  email: 'email',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  street: 'address',
  city: 'city',
  state: 'state',
  zip_code: 'zip',
  mailing_street: 'mailingAddress',
  mailing_city: 'mailingCity',
  mailing_state: 'mailingState',
  mailing_zip_code: 'mailingZip',
  phone: 'phone',
  phone_type: 'phoneType',
  marital_status:'maritalStatus',
  applicationId: (source) => source.id
}

export const preferenceFieldMapper = {
  'recordtype_developername': 'recordTypeDevName',
  id: 'shortformPreferenceID',
  'application_member__r.id': 'appMemberID',
  certificate_number: 'certificateNumber',
  individual_preference: 'individualPreference',
  lw_type_of_proof__c: 'lwPreferenceProof',
  opt_out: 'optOut',
  type_of_proof: "preferenceProof",
  city: 'city',
  state: 'state',
  street: 'address',
  zip_code: 'zipCode',
  listing_preference_id: 'listingPreferenceID'
}

export const applicationFieldMapper = {
  id: 'id',
  has_military_service: 'hasMilitaryService',
  has_developmental_disability: 'hasDevelopmentalDisability',
  answered_community_screening: 'answeredCommunityScreening',
  annual_income: 'annualIncome',
  housing_voucher_or_subsidy: 'householdVouchersSubsidies',
  terms_acknowledged: 'agreeToTerms',
  number_of_dependents: 'numberOfDependents'
}

export const householdMembersFieldMapper = {
  date_of_birth: 'DOB',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  street: 'address',
  city: 'city',
  state: 'state',
  zip_code: 'zip',
}

export const alternateContactFieldMapper = {
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  alternate_contact_type: 'alternateContactType',
  alternate_contact_type_other: 'alternateContactTypeOther',
  agency_name: 'agency',
  email: 'email',
  phone: 'phone',
  phone_type: 'phoneType'
}

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.listing.id,
  ...{
    primaryApplicant: shapeMapper('applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}
