import { fromPairs, omit, snakeCase, split } from 'lodash'
import { mapApplicationMember } from './application_member'
import { mapApplicationPreference } from './application_preference'
import { mapDemographics } from './demographics'
import { mapFlaggedApplication } from './flagged_application'
import { mapListing } from './listing'
import { mapUser } from './user'
import { mapShape, mapList } from '../utils'
import formUtils from '~/utils/formUtils'

const parseList = text => split(text, ';')
const toChecklist = list => fromPairs(list.map(i => [snakeCase(i), true]))

export const mapApplication = (a) => {
  console.log(a.Has_ADA_Priorities_Selected)
  return {
    applicant: mapShape(mapApplicationMember, a.Applicant),
    demographics: mapShape(mapDemographics, a.Applicant),
    primary_applicant_contact: a.Primary_Applicant,
    // Remove id from alternate contact to allow leasing agents to delete alt contact.
    alternate_contact: omit(mapShape(mapApplicationMember, a.Alternate_Contact), 'id'),
    listing: mapShape(mapListing, a.Listing),
    preferences: mapList(mapApplicationPreference, a.preferences),
    proof_files: a.proof_files,
    household_members: mapList(mapApplicationMember, a.household_members),
    flagged_applications: mapList(mapFlaggedApplication, a.flagged_applications),
    lease: a.lease,
    rental_assistances: a.rental_assistances,
    createdby: mapShape(mapUser, a.CreatedBy),
    id: a.Id,
    name: a.Name,
    status: a.Status,
    total_household_size: a.Total_Household_Size,
    application_submission_type: a.Application_Submission_Type,
    application_submitted_date: a.Application_Submitted_Date,
    annual_income: formUtils.formatPrice(a.Annual_Income),
    confirmed_household_annual_income: formUtils.formatPrice(a.Confirmed_Household_Annual_Income),
    hh_total_income_with_assets_annual: formUtils.formatPrice(a.HH_Total_Income_with_Assets_Annual),
    household_assets: formUtils.formatPrice(a.Household_Assets),
    monthly_income: a.Monthly_Income,
    housing_voucher_or_subsidy: a.Housing_Voucher_or_Subsidy,
    referral_source: a.Referral_Source,
    application_language: a.Application_Language,
    lottery_number_manual: a.Lottery_Number_Manual,
    lottery_number: a.Lottery_Number,
    total_monthly_rent: formUtils.formatPrice(a.Total_Monthly_Rent),
    general_lottery: a.General_Lottery,
    general_lottery_rank: a.General_Lottery_Rank,
    answered_community_screening: a.Answered_Community_Screening,
    has_military_service: a.Has_Military_Service,
    has_developmental_disability: a.Has_DevelopmentalDisability,
    has_ada_priorities_selected: toChecklist(parseList(a.Has_ADA_Priorities_Selected)),
    terms_acknowledged: a.Terms_Acknowledged,
    number_of_dependents: a.Number_of_Dependents,
    number_of_seniors: a.Number_of_Seniors,
    number_of_minors: a.Number_of_Minors,
    processing_status: a.Processing_Status,
    status_last_updated: a.Status_Last_Updated,
    reserved_senior: a.Reserved_Senior,
    is_first_time_homebuyer: a.Is_First_Time_Homebuyer,
    has_completed_homebuyer_education: a.Has_Completed_Homebuyer_Education,
    has_loan_preapproval: a.Has_Loan_Pre_approval,
    lending_agent: a.Lending_Agent
  }
}
