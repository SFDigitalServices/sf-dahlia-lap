export const buildListingApplicationModel = (value) => {
  return {
    id: value.id,
    name: value.name,
    listing_name: value.listing.name,
    listing_lottery_date: value.listing.lottery_date,
    applicant_first_name: value.applicant.first_name,
    applicant_last_name: value.applicant.last_name,
    application_submitted_date: value.application_submitted_date,
    total_household_size: value.total_household_size,
    application_submission_type: value.application_submission_type
  }
}
