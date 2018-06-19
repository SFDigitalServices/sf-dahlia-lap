
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
    preference_order: application['Preference_Order']
  }
}

export const mapListingDetails = (listing) => {
  // return listing
  return {
    id:listing.Id,
    owner_id: listing.OwnerId,
    owner: {
      name: listing.Owner.Name
    },
    application_due_date: listing.Application_Due_Date,
    name: listing.Name,
    status: listing.Status,
    building: { name : listing.Building.Name },
    min_br: listing.Min_BR,
    lotterry_winners: listing.Lottery_Winners,
    max_br: listing.Max_BR,
    lottery_results: listing.Lottery_Results,
    min_income: listing.Min_Income,
    account: {
      name: listing.Account.Name
    },
    max_income: listing.Max_Income,
    min_occupancy: listing.Min_Occupancy,
    max_occupancy: listing.Max_Occupancy,
    building_name: listing.Building_Name,
    neighborhood: listing.Neighborhood,
    building_street_address: listing.Building_Street_Address,
    developer: listing.Developer,
    building_city: listing.Building_City,
    building_url: listing.Building_URL,
    building_state: listing.Building_State,
    year_built: listing.Year_Built,
    building_zip_code: listing.Building_Zip_Code,
    description: listing.Description,
    lottery_prefrences: listing.Lottery_Preferences,
    acessibility: listing.Accessibility,
    fee: listing.Fee,
    amenities: listing.Amenities,
    deposit_min: listing.Deposit_Min,
    costs_not_included: listing.Costs_Not_Included,
    deposit_max: listing.Deposit_Max,
    lottery_date: listing.Lottery_Date,
    lottery_results_date: listing.Lottery_Results_Date,
    lottery_venue: listing.Lottery_Venue,
    lottery_summary: listing.Lottery_Summary,
    lottery_street_address: listing.Lottery_Street_Address,
    lottery_city: listing.Lottery_City,
    lottery_url: listing.Lottery_URL,
    reserved_community_type: listing.Reserved_community_type,
    application_phone: listing.Application_Phone,
    application_organization: listing.Application_Organization,
    application_street_address: listing.Application_Street_Address,
    application_city: listing.Application_City,
    download_url: listing.Download_URL,
    application_state: listing.Application_State,
    organization_url: listing.Organization_URL,
    application_postal_code: listing.Application_Postal_Code,
    in_lottery: listing.In_Lottery,
    leasing_agent_name: listing.Leasing_Agent_Name,
    Leasing_Agent_title: listing.Leasing_Agent_Title,
    leasing_agent_email: listing.Leasing_Agent_Email,
    leasing_agent_phone: listing.Leasing_Agent_Phone,
    legal_disclaimers: listing.Legal_Disclaimers,
    building_selection_criteria: listing.Building_Selection_Criteria,
    pet_policy: listing.Pet_Policy,
    required_documents: listing.Required_Documents,
    smoking_policy: listing.Smoking_Policy,
    eviction_history: listing.Eviction_History,
    criminal_history: listing.Criminal_History,
    credit_rating: listing.Credit_Rating,
    lottery_status: listing.Lottery_Status,
    office_hours: listing.Office_Hours,
    information_sessions: listing.Information_Sessions,
    open_houses: mapOpenHouses(listing.Open_Houses),
    listing_lottery_preferences: listing.Listing_Lottery_Preferences.map(mapListingLotteryPreferece),
    units: listing.Units.map(mapUnit)
  }
}

const mapOpenHouses =(open_houses) => {
  return open_houses
}

const mapListingLotteryPreferece = (i) => {
  return {
    id:i.Id,
    total_submitted_apps:i.Total_Submitted_Apps,
    order:i.Order,
    description:i.Description,
    available_units:i.Available_Units,
    pdf_url:i.PDF_URL,
    lottery_preference: {
      id: i.Lottery_Preference.Id,
      name: i.Lottery_Preference.Name
    }
  }
}

// TODO: this is not being mapped in the Component
const mapUnit = (unit) => {
  return {
    unit_type: unit.Unit_Type,
    bmr_rent_monthly: unit.BMR_Rent_Monthly,
    bmr_rental_minimum_monthly_income_needed: unit.BMR_Rental_Minimum_Monthly_Income_Needed,
    status: unit.Status,
    property_type: unit.Property_Type,
    ami_chart_type: unit.AMI_chart_type,
    ami_chart_year: unit.AMI_chart_year,
    of_ami_for_pricing_unit: unit.of_AMI_for_Pricing_Unit,
    reserved_type: unit.Reserved_Type,
  }
}

export const mapFlaggedRecords = (flaggedRecord) => {
  return {
    id: flaggedRecord.Id,
    listing_name: flaggedRecord['Listing.Name'],
    rule_name: flaggedRecord.Rule_Name,
    total_number_of_pending_review: flaggedRecord.Total_Number_of_Pending_Review,
    total_number_of_appealed: flaggedRecord.Total_Number_of_Appealed,
  }
}

export const mapFlaggedApplication = (flaggedApplication) => {
  return {
    id: flaggedApplication.Id,
    application: flaggedApplication.Application,
    application_name: flaggedApplication['Application.Name'] ,
    flagged_record_set_rule_name: flaggedApplication['Flagged_Record_Set.Rule_Name'],
    primary_application_applicant_name: flaggedApplication['Primary_Application_Applicant_Name'],
    flagged_Record_set_listing_lottery_status: flaggedApplication["Flagged_Record_Set.Listing.Lottery_Status"],
    review_status: flaggedApplication["Review_Status"],
    comments: flaggedApplication['Comments']
  }
}
