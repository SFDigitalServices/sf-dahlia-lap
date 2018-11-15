export const buildLeaseUpAppGenLotteryModel = (application) => {
  const applicant = application.applicant

  return {
    application_id: application.id,
    application_number: application.name,
    first_name: applicant.first_name,
    last_name: applicant.last_name,
    phone: applicant.phone,
    email: applicant.email,
    mailing_address: applicant.mailing_address,
    residence_address: applicant.residence_address,
    lease_up_status: application.processing_status,
    status_last_updated: application.status_last_updated,
    preference_record_type: 'GEN',
    preference_lottery_rank: application.general_lottery_rank,
    post_lottery_validation: application.post_lottery_validation
  }
}
