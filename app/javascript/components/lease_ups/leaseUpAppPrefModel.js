export const buildLeaseUpAppPrefModel = (applicationPreference) => {
  const application = applicationPreference.application
  const applicant = application.applicant
  const listingPreference = applicationPreference.listing_preference

  return {
    application_preference_id: applicationPreference.id,
    application_id: application.id,
    application_number: application.name,
    first_name: applicant.first_name,
    last_name: applicant.last_name,
    phone: applicant.phone,
    email: applicant.email,
    mailing_address: applicant.mailing_address,
    residence_address: applicant.residence_address,
    has_ada_priorities_selected: application.has_ada_priorities_selected,
    lease_up_status: application.processing_status,
    status_last_updated: application.status_last_updated,
    preference_order: applicationPreference.preference_order,
    // Application preference names have abbreviations but General does not, here we check if it is general, otherwise use the abbreviation
    preference_record_type: applicationPreference.preference_name && applicationPreference.preference_name.includes('General') ? applicationPreference.preference_name : listingPreference.record_type_for_app_preferences,
    preference_lottery_rank: applicationPreference.preference_all_lottery_rank || applicationPreference.preference_lottery_rank,
    post_lottery_validation: applicationPreference.post_lottery_validation
  }
}
