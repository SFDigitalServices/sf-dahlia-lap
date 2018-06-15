
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

export const mapListingDetails = (listing) => {
  return {
    owner_name: 'Owner.Name',
    name: 'Name',
    account_name: 'Account.Name',
    application_due_date: 'Application_Due_Date',
    in_lottery: 'In_Lottery',
    status: 'Status',
    lottery_winners: 'Lottery_Winners',
    lottery_results: 'Lottery_Results',
    building_name: 'Building_Name',
    building_street_address: 'Building_Street_Address',
    building_city: 'Building_City',
    building_state: 'Building_State',
    building_zip_code: 'Building_Zip_Code',
    neighborhood: 'Neighborhood',
    developer: 'Developer',
    building_url: 'Building_URL',
    year_built: 'Year_Built',
    description: 'Description',
    lottery_preferences: 'Lottery_Preferences'
    lottery_preference_name: 'Lottery_Preference.Name'
    // 'Description',
    // 'PDF_URL',
    // 'Order',
    // 'Available_Units'
  }
}
