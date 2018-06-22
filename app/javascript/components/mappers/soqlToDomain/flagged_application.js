export const mapFlaggedApplication = (flaggedApplication) => {
  return {
    id: flaggedApplication.Id,
    application: flaggedApplication.Application,
    application_name: flaggedApplication['Application.Name'] ,
    flagged_record_set_rule_name: flaggedApplication['Flagged_Record_Set.Rule_Name'],
    primary_application_applicant_name: flaggedApplication['Primary_Application_Applicant_Name'],
    flagged_record_set_listing_lottery_status: flaggedApplication["Flagged_Record_Set.Listing.Lottery_Status"],
    review_status: flaggedApplication["Review_Status"],
    comments: flaggedApplication['Comments']
  }
}
