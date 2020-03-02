import { keys, map, join } from 'lodash'
import formOptions from '../application_form/formOptions'

export const applicationDataFields = [
  'lottery_number',
  'application_submission_type',
  'application_submitted_date',
  'application_language',
  'total_household_size',
  { field: 'total_monthly_rent', formatType: 'currency' },
  'status',
  'referral_source',
  { field: 'createdby.name', label: 'Created By' }
]

export const primaryApplicantFields = [
  'first_name',
  'middle_name',
  'last_name',
  'date_of_birth',
  'email',
  'phone',
  'phone_type',
  'second_phone',
  'second_phone_type',
  'residence_address',
  'mailing_address'
]

export const alternateContactFields = [
  'first_name',
  'middle_name',
  'last_name',
  'phone',
  'phone_type',
  'agency_name',
  'email',
  'alternate_contact_type',
  'alternate_contact_type_other',
  'mailing_address'
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

const adaPrioritiesToString = (list) => join(map(keys(list), v => formOptions.adaPriorityValueToLabelMap[v]), ';')

export const reservedAndPriorityFields = [
  'has_military_service',
  { field: 'has_developmental_disability', label: 'Has Developmental Disability' },
  { field: 'has_ada_priorities_selected', value: (v) => adaPrioritiesToString(v) },
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
  { field: 'annual_income', formatType: 'currency' },
  { field: 'monthly_income', formatType: 'currency' },
  'housing_voucher_or_subsidy'
]

export const flaggedApplicationsFields = [
  { field: 'flagged_record.rule_name', label: 'Rule Name' },
  { field: 'flagged_record.total_number_of_pending_review', label: 'Total Number of Pending Review' },
  'view record set'
]

export const applicationEligibilityFields = [
  { field: 'is_first_time_homebuyer', label: 'Have they owned property in the last three years?' },
  { field: 'has_completed_homebuyer_education', label: 'Have they completed homebuyers\' education?' },
  { field: 'has_loan_preapproval', label: 'Do they have a loan pre-approval from a MOHCD-approved lender?' },
  { field: 'lending_institution', label: 'Lending Institution' },
  { field: 'name_of_lender', label: 'Name of Lender' }
]
