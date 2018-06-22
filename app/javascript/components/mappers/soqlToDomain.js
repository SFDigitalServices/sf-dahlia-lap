import { mapShape, mapList } from './utils'

export { mapApplicationPreference } from './soqlToDomain/application_preference'
export { mapFormApplication } from './soqlToDomain/application'
export { mapListingDetails } from './soqlToDomain/listing'
export { mapFlaggedApplication } from './soqlToDomain/flagged_application'
export { mapFlaggedRecord } from './soqlToDomain/flagged_record'
export { mapFieldUpdateComment } from './soqlToDomain/field_update_comment'


export const mapListing = (listing) => {
  if (!listing)
    return null
  else {
    return {
      id: listing.Id,
      name: listing.Name,
      building_street_address: listing.Building_Street_Address
    }
  }
}

export const mapListingApplicationPage = (application) => {
  return {
    id: application.Id,
    name: application.Name,
    listing_name: application['Listing.Name'],
    listing_lottery_date: application['Listing.Lottery_Date'],
    applicant_first_name: application['Applicant.First_Name'],
    applicant_last_name: application['Applicant.Last_Name'],
    application_submitted_date: application.Application_Submitted_Date,
    total_household_size: application.Total_Household_Size,
    application_submission_type: application.Application_Submission_Type
  }
}

export const mapListingsTableItem = (listing) => {
  return  {
    id: listing.Id,
    name: listing.Name,
    application_due_date: listing.Application_Due_Date,
    lottery_date: listing.Lottery_Date,
    lottery_results_date: listing.Lottery_Results_Date,
    lottery_status: listing.Lottery_Status,
    nflagged_applications: listing.nFlagged_Applications,
    in_lottery: listing.In_Lottery
  }
}

export const mapSupplementalApplication = (application) => {
  return {
    id: application.Id,
    number: application.Name,
    name: application.Applicant ? application.Applicant.Name: '',
    isLotterComplete: application.Is_Lottery_Complete,
    submissionType: application.Application_Submission_Type,
    listing: mapListing(application.Listing)
  }
}

// export const mapLeaseUpApplication = (applicationPreferenceSOQL) => {
//   console.log('fede')
//   console.log(applicationPreferenceSOQL)
//   let applicationPreference = mapApplicationPreference(applicationPreferenceSOQL)
//
//   applicationPreference.application = mapShape(applicationPreferenceSOQL.Application)
//
//   return applicationPreference
//
//   // return {
//   //   id: applicationPreference.application.id,
//   //   application_number: applicationPreference.application.name,
//   //   first_name: application['Application.First_Name'],
//   //   last_name: application['Application.Last_Name'],
//   //   phone: application['Application.Phone'],
//   //   email: application['Application.Email'],
//   //   mailing_address: application['Application.Mailing_Address'],
//   //   residence_address: application['Application.Residence_Address'],
//   //   lease_up_status: application['Application.Processing_Status'],
//   //
//   //   status_updated: application['Status_Last_Updated'],
//   //   preference_order: application['Preference_Order'],
//   //   preference_record_type: application['Listing_Preference_ID.Record_Type_For_App_Preferences'],
//   //   preference_lottery_rank: application['Preference_Lottery_Rank'],
//   //   preference_order: application['Preference_Order']
//   // }
//
//   // return {
//   //   id: application['Application'],
//   //   application_number: application['Application.Name'],
//   //   first_name: application['Application.First_Name'],
//   //   last_name: application['Application.Last_Name'],
//   //   phone: application['Application.Phone'],
//   //   email: application['Application.Email'],
//   //   mailing_address: application['Application.Mailing_Address'],
//   //   residence_address: application['Application.Residence_Address'],
//   //   lease_up_status: application['Application.Processing_Status'],
//
//   //   status_updated: application['Status_Last_Updated'],
//   //   preference_order: application['Preference_Order'],
//   //   preference_record_type: application['Listing_Preference_ID.Record_Type_For_App_Preferences'],
//   //   preference_lottery_rank: application['Preference_Lottery_Rank'],
//   //   preference_order: application['Preference_Order']
//   // }
// }
