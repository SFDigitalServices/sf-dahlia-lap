export const buildLeaseUpModel = (applicationPreference) => {
  const application = applicationPreference.application
  const applicant = application.applicant
  const listingPreference = applicationPreference.listing_preference

  return {
    id: applicationPreference.id,
    application_id: application.id,
    application_number: application.name,
    first_name: applicant.first_name,
    last_name: applicant.last_name,
    phone: applicant.phone,
    email: applicant.email,
    mailing_address: applicant.mailing_address,
    residence_address: applicant.residence_address,
    lease_up_status: application.processing_status,
    status_updated: applicationPreference.last_modified_date,
    preference_order: applicationPreference.preference_order,
    preference_record_type: listingPreference.record_type_for_app_preferences,
    preference_lottery_rank: applicationPreference.preference_lottery_rank,
    post_lottery_validation: applicationPreference.post_lottery_validation
  }
}
