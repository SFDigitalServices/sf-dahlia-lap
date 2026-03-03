import { getSubStatusLabel } from '../../utils/statusUtils'

export const buildLeaseUpAppFirstComeFirstServedModel = (application) => {
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
    has_ada_priorities_selected: application.has_ada_priorities_selected,
    total_household_size: application.total_household_size,
    sub_status: application.sub_status,
    sub_status_label: getSubStatusLabel(application.processing_status, application.sub_status),
    // preference order doesn't matter for fcfs listings and all applications are 'General'
    preference_lottery_rank: application.general_lottery_rank,
    preference_order: 1,
    preference_name: 'General'
  }
}
