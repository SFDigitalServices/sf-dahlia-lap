import { mapFields } from '~/utils/objectUtils'

export const applicantFieldMapper = {
  Date_of_Birth: 'DOB',
  Email: 'email',
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Street: 'address',
  City: 'city',
  State: 'state',
  Zip_Code: 'zip',
  Mailing_Street: 'mailingAddress',
  Mailing_City: 'mailingCity',
  Mailing_State: 'mailingState',
  Mailing_Zip_Code: 'mailingZip',
  Phone: 'phone',
  Phone_Type: 'phoneType',
}

export const preferenceFieldMapper = {
  Listing_Preference_ID: "listingPreferenceID",
  Individual_preference: "individualPreference",
  Certificate_Number: "certificateNumber",
  Type_of_proof: "preferenceProof",
  Preference_Name: "preferenceName"
}

export const applicationFieldMapper = {
  Has_Military_Service: 'hasMilitaryService',
  Has_DevelopmentalDisability: 'hasDevelopmentalDisability',
  Answered_Community_Screening: 'answeredCommunityScreening',
  Annual_Income: 'annualIncome',
  Housing_Voucher_or_Subsidy: 'householdVouchersSubsidies',
  Terms_Acknowledged: 'agreeToTerms'
}

export const householdMembersfieldMapper = {
  Date_of_Birth: 'DOB',
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Street: 'address',
  City: 'city',
  State: 'state',
  Zip_Code: 'zip',
}

const map = (field, fieldsMapper) => (source) => {
  return mapFields(fieldsMapper, {}, source[field])
}

const mapList = (field, fieldsMapper) =>  (source) => {
  return source[field].map(i => mapFields(fieldsMapper, {}, i))
}

export const applicationShape = {
  ...applicationFieldMapper,
  ...{
    primaryApplicant: map('Applicant', applicantFieldMapper),
    shortFormPreferences: mapList('preferences', preferenceFieldMapper),
    householdMembers: mapList('household_members', householdMembersfieldMapper)
  }
}
