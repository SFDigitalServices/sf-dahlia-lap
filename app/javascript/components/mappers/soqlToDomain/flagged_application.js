import { mapShape } from '../utils'
import { mapFormApplication } from './application'
import { mapFlaggedRecord } from './flagged_record'

export const mapFlaggedApplication = (flaggedApplication) => {
  return {
    application: mapShape(mapFormApplication, flaggedApplication.Application),
    flagged_record: mapShape(mapFlaggedRecord, flaggedApplication.Flagged_Record_Set),
    id: flaggedApplication.Id,
    primary_application_applicant_name: flaggedApplication.Primary_Application_Applicant_Name,
    review_status: flaggedApplication.Review_Status,
    comments: flaggedApplication.Comments
    // flagged_record_set_rule_name: flaggedApplication.Flagged_Record_Set.Rule_Name,
    // application: flaggedApplication.Application,
    // application_name: flaggedApplication['Application.Name'] ,
    // flagged_record_set_listing_lottery_status: flaggedApplication["Flagged_Record_Set.Listing.Lottery_Status"],

  }
}
