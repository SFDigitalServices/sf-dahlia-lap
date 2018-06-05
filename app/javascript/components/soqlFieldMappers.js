import { shapeMapper, listMapper } from '~/utils/objectUtils'

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
  Marital_Status:'maritalStatus'
}

// Listing_Preference_ID: "listingPreferenceID",
// Preference_Name: "preferenceName",
// Application_Preference: ''
// Requires_Proof: ''
// Type_of_proof
// Type_of_proof: "preferenceProof",
// Preference_Proof: 'preferenceProof',
export const preferenceFieldMapper = {
  Individual_preference: "individualPreference",
  Certificate_Number: "certificateNumber",
  'RecordType.DeveloperName': 'recordTypeDevName',
  Id: 'shortformPreferenceID',
  'Application_Member__r.Id': 'appMemberID',
  Certificate_Number: 'certificateNumber',
  Individual_preference: 'individualPreference',
  LW_Type_of_Proof__c: 'lwPreferenceProof',
  Opt_Out: 'optOut',
  Type_of_proof: "preferenceProof",
  City: 'city',
  State: 'state',
  Street: 'address',
  Zip_Code: 'zipCode',
  Listing_Preference_ID: 'listingPreferenceID'
}

export const applicationFieldMapper = {
  Id: 'id',
  Has_Military_Service: 'hasMilitaryService',
  Has_DevelopmentalDisability: 'hasDevelopmentalDisability',
  Answered_Community_Screening: 'answeredCommunityScreening',
  Annual_Income: 'annualIncome',
  Housing_Voucher_or_Subsidy: 'householdVouchersSubsidies',
  Terms_Acknowledged: 'agreeToTerms',
  applicationId: "a0o0x000000OHykAAG"
}

export const householdMembersFieldMapper = {
  Date_of_Birth: 'DOB',
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Street: 'address',
  City: 'city',
  State: 'state',
  Zip_Code: 'zip',
}

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.Listing.Id,
  ...{
    primaryApplicant: shapeMapper('Applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}
