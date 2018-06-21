export const applicationDataFields = [
  'lottery_number',
  'application_submission_type',
  'application_submitted_date',
  'application_language',
  'total_household_size',
  'total_monthly_rent',
  'status',
  'referral_source',
  'createdby.name'
]

export const primaryApplicantFields = [
  'first_name',
  'last_name',
  'date_of_birth',
  'phone',
  'Second_Phone',
  'email',
  'residence_address',
  'mailing_address',
]

export const alternateContactFields = [
  'first_name',
  'last_name',
  'phone',
  'agency_name',
  'email',
  'alternate_contact_type',
  'alternate_contact_type_other'
]

export const householdMembersFields = [
  'name',
  'relationship_to_applicant',
  'date_of_birth',
  'street',
  'city',
  'state',
  'zip_code'
]

export const reservedAndPriorityFields = [
  'has_military_service',
  'has_developmentaldisability',
  'has_ada_priorities_selected',
  'answered_community_screening'
]

export const applicationPreferencesFields = [
  'receives_preference',
  'preference_name',
  'lottery_status',
  'person_who_claimed_name',
  'type_of_proof',
  'preference_lottery_rank',
  'opt_out'
]

export const declareHousholdIncome = [
  'annual_income',
  'monthly_income',
  'housing_voucher_or_subsidy'
]

export const flaggedApplicationsFields = [
  { field: 'flagged_record_set.rule_name', label: 'Rule Name' },
  { field: 'flagged_record_set.total_number_of_pending_review', label: 'Total Number of Pending Review'  },
  'view record set'
]
