
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

export const mapApplication = (application) => {
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
    preference_order:  application['Preference_Order']
  }
}
