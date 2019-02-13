import { toPairs, filter, map, join, compact } from 'lodash'
import { createFieldMapper } from '~/utils/objectUtils'
import { currencyToFloat } from '~/utils/utils'
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
  householdAssets: (source) => currencyToFloat(source.household_assets),
  annualIncome: (source) => currencyToFloat(source.annual_income),
  monthlyIncome: (source) => currencyToFloat(source.monthly_income),
  confirmedHouseholdAnnualIncome: (source) => currencyToFloat(source.confirmed_household_annual_income),
  HHTotalIncomeWithAssets: (source) => currencyToFloat(source.hh_total_income_with_assets_annual),
  totalMonthlyRent: (source) => currencyToFloat(source.total_monthly_rent),
  adaPrioritiesSelected: (source) => checkListToString(mapAdaPrioritiesMap(source.has_ada_priorities_selected))
}

export const mapApplication = createFieldMapper(applicationFieldMapper)
