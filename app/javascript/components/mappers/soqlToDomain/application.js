import { mapShape, mapList } from '../utils'
import { mapApplicationMember } from './application_member'
import { mapFlaggedApplication } from './flagged_application'
import { mapUser } from './user'
import { mapListingDetails } from './listing'
import { mapApplicationPreference } from './application_preference'
import { mapAttachment } from './attachment'

export const mapFormApplication = (a) => {
  return {
    applicant: mapShape(mapApplicationMember,a.Applicant),
    alternate_contact: mapShape(mapApplicationMember,a.Alternate_Contact),
    listing: mapShape(mapListingDetails, a.Listing),
    preferences: mapList(mapApplicationPreference, a.preferences),
    proof_files: mapList(mapAttachment, a.proof_files),
    household_members: mapList(mapApplicationMember, a.household_members),
    flagged_applications: mapList(mapFlaggedApplication, a.flagged_applications),
    createdby: mapShape(mapUser, a.CreatedBy),
    id: a.Id,
    name: a.Name,
    status: a.Status,
    total_household_size: a.Total_Household_Size,
    application_submission_type: a.Application_Submission_Type,
    application_submitted_date: a.Application_Submitted_Date,
    annual_income: a.Annual_Income,
    monthly_income: a.Monthly_Income,
    is_lottery_complete: a.Is_Lottery_Complete,
    housing_voucher_or_subsidy: a.Housing_Voucher_or_Subsidy,
    referral_source: a.Referral_Source,
    application_language: a.Application_Language,
    lottery_number_manual: a.Lottery_Number_Manual,
    lottery_number: a.Lottery_Number,
    total_monthly_rent: a.Total_Monthly_Rent,
    general_lottery: a.General_Lottery,
    general_lottery_rank: a.General_Lottery_Rank,
    answered_community_screening: a.Answered_Community_Screening,
    has_military_service: a.Has_Military_Service,
    has_developmentaldisability: a.Has_DevelopmentalDisability,
    has_ada_priorities_selected: a.Has_ADA_Priorities_Selected,
    terms_acknowledged: a.Terms_Acknowledged,
    number_of_dependents: a.Number_of_Dependents,
    processing_status: a.Processing_Status
  }
}
