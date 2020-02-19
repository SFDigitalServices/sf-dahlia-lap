import { toPairs, filter, map, join, compact } from 'lodash'
import { createFieldMapper } from '~/utils/objectUtils'
const checkListToString = (list) => {
  return join(compact(list), ';')
}

const adaPrioritiesMapValues = {
  'vision_impairments': 'Vision impairments',
  'mobility_impairments': 'Mobility impairments',
  'hearing_impairments': 'Hearing impairments'
}

const mapAdaPrioritiesMap = (list) => {
  const selectedPriorities = filter(toPairs(list), ([a, b]) => b)
  return map(selectedPriorities, ([a, b]) => adaPrioritiesMapValues[a])
}

export const applicationFieldMapper = {
  id: 'id',
  primary_applicant_contact: 'primaryApplicantContact',
  application_language: 'applicationLanguage',
  has_military_service: 'hasMilitaryService',
  has_developmental_disability: 'hasDevelopmentalDisability',
  answered_community_screening: 'answeredCommunityScreening',
  housing_voucher_or_subsidy: 'householdVouchersSubsidies',
  terms_acknowledged: 'agreeToTerms',
  number_of_dependents: 'numberOfDependents',
  number_of_seniors: 'numberOfSeniors',
  number_of_minors: 'numberOfMinors',
  reserved_senior: 'hasSenior',
  application_submission_type: 'applicationSubmissionType',
  processing_status: 'processingStatus',
  household_assets: 'householdAssets',
  annual_income: 'annualIncome',
  monthly_income: 'monthlyIncome',
  confirmed_household_annual_income: 'confirmedHouseholdAnnualIncome',
  hh_total_income_with_assets_annual: 'HHTotalIncomeWithAssets',
  total_monthly_rent: 'totalMonthlyRent',
  adaPrioritiesSelected: (source) => checkListToString(mapAdaPrioritiesMap(source.has_ada_priorities_selected)),
  is_first_time_homebuyer: 'isFirstTimeHomebuyer',
  has_completed_homebuyer_education: 'hasCompletedHomebuyerEducation',
  has_loan_preapproval: 'hasLoanPreapproval',
  lending_agent: 'lendingAgent'
}

export const mapApplication = createFieldMapper(applicationFieldMapper)
