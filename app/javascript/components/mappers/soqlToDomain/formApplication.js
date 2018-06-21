import { mapShape, mapList } from '../utils'

const mapApplicant = (value) => {
  return {
    id:value.Id,
    first_name:value.First_Name,
    last_name:value.Last_Name,
    middle_name:value.Middle_Name,
    name:value.Name,
    date_of_birth:value.Date_of_Birth,
    phone_type:value.Phone_Type,
    phone:value.Phone,
    second_phone_type:value.Second_Phone_Type,
    second_phone:value.Second_Phone,
    email:value.Email,
    primary_language:value.Primary_Language,
    residence_address:value.Residence_Address,
    street:value.Street,
    city:value.City,
    state:value.State,
    zip_code:value.Zip_Code,
    mailing_address:value.Mailing_Address,
    mailing_street:value.Mailing_Street,
    mailing_city:value.Mailing_City,
    mailing_state:value.Mailing_State,
    mailing_zip_code:value.Mailing_Zip_Code,
    marital_status:value.Marital_Status
  }
}

const mapAlternateContact = (value) => {
  return {
    id:value.Id,
    first_name:value.First_Name,
    middle_name:value.Middle_Name,
    last_name:value.Last_Name,
    phone_type:value.Phone_Type,
    phone:value.Phone,
    email:value.Email,
    agency_name:value.Agency_Name,
    alternate_contact_type:value.Alternate_Contact_Type,
    alternate_contact_type_other:value.Alternate_Contact_Type_Other
  }
}

const mapListing = (value) => {
  return {
    name:value.Name,
    id:value.Id,
    reserved_community_type:value.Reserved_community_type
  }
}

const mapCreatedBy = (value) => {
  return {
    name:value.Name
  }
}

const mapPreferences = (value) => {
  return {
    id:value.Id,
    name:value.Name,
    preference_name:value.Preference_Name,
    person_who_claimed_name:value.Person_who_claimed_Name,
    type_of_proof:value.Type_of_proof,
    opt_out:value.Opt_Out,
    lottery_status:value.Lottery_Status,
    preference_lottery_rank:value.Preference_Lottery_Rank,
    listing_preference_id:value.Listing_Preference_ID,
    receives_preference:value.Receives_Preference,
    application_member:value.Application_Member,
    application_member_first_name:value['Application_Member.First_Name'],
    application_member_last_name:value['Application_Member.Last_Name'],
    application_member_date_of_birth:value['Application_Member.Date_of_Birth'],
    individual_preference:value.Individual_preference,
    certificate_number:value.Certificate_Number,
    preference_order:value.Preference_Order,
    city:value.City,
    state:value.State,
    zip_code:value.Zip_Code,
    street:value.Street,
    recordtype_developername:value['RecordType.DeveloperName']
  }
}

const mapProoffiles = (value) => {
  return {
    id: value.Id,
    name: value.Name
  }
}

const mapHouseholdmembers = (value) => {
  return {
    id:value.Id,
    name:value.Name,
    first_name:value.First_Name,
    last_name:value.Last_Name,
    middle_name:value.Middle_Name,
    relationship_to_applicant:value.Relationship_to_Applicant,
    date_of_birth:value.Date_of_Birth,
    street:value.Street,
    city:value.City,
    state:value.State,
    zip_code:value.Zip_Code
  }
}

const mapFlaggedapplications = (value) => {
  return {}
}

export const mapFormApplication = (application) => {
  return {
    id: application.Id,
    name: application.Name,
    applicant: mapShape(mapApplicant,application.Applicant),
    alternate_contact: mapShape(mapAlternateContact,application.Alternate_Contact),
    listing: mapShape(mapListing,application.Listing),
    status: application.Status,
    total_household_size: application.Total_Household_Size,
    application_submission_type: application.Application_Submission_Type,
    application_submitted_date: application.Application_Submitted_Date,
    createdby: mapShape(mapCreatedBy, application.CreatedBy),
    annual_income: application.Annual_Income,
    monthly_income: application.Monthly_Income,
    is_lottery_complete: application.Is_Lottery_Complete,
    housing_voucher_or_subsidy: application.Housing_Voucher_or_Subsidy,
    referral_source: application.Referral_Source,
    application_language: application.Application_Language,
    lottery_number_manual: application.Lottery_Number_Manual,
    lottery_number: application.Lottery_Number,
    total_monthly_rent: application.Total_Monthly_Rent,
    general_lottery: application.General_Lottery,
    general_lottery_rank: application.General_Lottery_Rank,
    answered_community_screening: application.Answered_Community_Screening,
    has_military_service: application.Has_Military_Service,
    has_developmentaldisability: application.Has_DevelopmentalDisability,
    has_ada_priorities_selected: application.Has_ADA_Priorities_Selected,
    terms_acknowledged: application.Terms_Acknowledged,
    preferences: mapList(mapPreferences, application.preferences),
    proof_files: mapList(mapProoffiles, application.proof_files),
    household_members: mapList(mapHouseholdmembers, application.household_members),
    flagged_applications: mapList(mapFlaggedapplications, application.flagged_applications),
    number_of_dependents: application.Number_of_Dependents
  }
}

// export default mapFormApplication
