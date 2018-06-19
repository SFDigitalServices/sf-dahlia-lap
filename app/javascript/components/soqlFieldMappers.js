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
  Marital_Status:'maritalStatus',
  applicationId: (source) => source.Id
}

export const preferenceFieldMapper = {
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
  Number_of_Dependents: 'numberOfDependents'
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

export const alternateContactFieldMapper = {
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Alternate_Contact_Type: 'alternateContactType',
  Alternate_Contact_Type_Other: 'alternateContactTypeOther',
  Agency_Name: 'agency',
  Email: 'email',
  Phone: 'phone',
  Phone_Type: 'phoneType'
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
