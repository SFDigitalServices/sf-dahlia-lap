import { mapShape } from '../utils'
import { mapApplication } from './application'
import { mapFlaggedRecord } from './flagged_record'

export const mapFlaggedApplication = (flaggedApplication) => {
  return {
    application: mapShape(mapApplication, flaggedApplication.Application),
    flagged_record: mapShape(mapFlaggedRecord, flaggedApplication.Flagged_Record_Set),
    id: flaggedApplication.Id,
    primary_application_applicant_name: flaggedApplication.Primary_Application_Applicant_Name,
    review_status: flaggedApplication.Review_Status,
    comments: flaggedApplication.Comments
  }
}
