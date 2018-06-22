import { mapShape, mapList } from './utils'

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

export const mapLeaseUpApplication = (application) => {
  return {
    id: application['Application'],
    application_number: application['Application.Name'],
    first_name: application['Application.First_Name'],
    last_name: application['Application.Last_Name'],
    phone: application['Application.Phone'],
    email: application['Application.Email'],
    status_updated: application['Status_Last_Updated'],
    lease_up_status: application['Application.Processing_Status'],
    preference_order: application['Preference_Order'],
    mailing_address: application['Application.Mailing_Address'],
    residence_address: application['Application.Residence_Address'],
    preference_record_type: application['Listing_Preference_ID.Record_Type_For_App_Preferences'],
    preference_lottery_rank: application['Preference_Lottery_Rank'],
    preference_order: application['Preference_Order']
  }
}

// export const mapFlaggedRecords = (flaggedRecord) => {
//   return {
//     id: flaggedRecord.Id,
//     listing_name: flaggedRecord['Listing.Name'],
//     rule_name: flaggedRecord.Rule_Name,
//     total_number_of_pending_review: flaggedRecord.Total_Number_of_Pending_Review,
//     total_number_of_appealed: flaggedRecord.Total_Number_of_Appealed,
//   }
// }

// export const mapFlaggedApplication = (flaggedApplication) => {
//   return {
//     id: flaggedApplication.Id,
//     application: flaggedApplication.Application,
//     application_name: flaggedApplication['Application.Name'] ,
//     flagged_record_set_rule_name: flaggedApplication['Flagged_Record_Set.Rule_Name'],
//     primary_application_applicant_name: flaggedApplication['Primary_Application_Applicant_Name'],
//     flagged_record_set_listing_lottery_status: flaggedApplication["Flagged_Record_Set.Listing.Lottery_Status"],
//     review_status: flaggedApplication["Review_Status"],
//     comments: flaggedApplication['Comments']
//   }
// }

// export const mapFieldUpdateComment = (item) => {
//   return {
//     status: item.Processing_Status,
//     note: item.Processing_Comment,
//     date: item.Processing_Date_Updated,
//     timestamp: moment(item.Processing_Date_Updated).unix()
//   }
// }

export { mapFormApplication } from './soqlToDomain/application'
export { mapListingDetails } from './soqlToDomain/listing'
export { mapFlaggedApplication } from './soqlToDomain/flagged_application'
export { mapFlaggedRecord } from './soqlToDomain/flagged_record'
export { mapFieldUpdateComment } from './soqlToDomain/field_update_comment'
