# TODO: Re-enable Rubocop's line length check on this file once
# we have settled on a format for the field mapping items
# rubocop:disable Metrics/LineLength
module Force
  # Represent an application object. Provide mapping between SOQL API
  # and LAP domain field names for applications.
  class Application < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { custom_api: 'adaPrioritiesSelected', domain: 'has_ada_priorities_selected', salesforce: 'Has_ADA_Priorities_Selected__c' },
      { custom_api: 'agreeToTerms', domain: 'terms_acknowledged', salesforce: 'Terms_Acknowledged__c' },
      { custom_api: 'annualIncome', domain: 'annual_income', salesforce: 'Annual_Income__c' },
      { custom_api: 'answeredCommunityScreening', domain: 'answered_community_screening', salesforce: 'Answered_Community_Screening__c' },
      { custom_api: 'applicationLanguage', domain: 'application_language', salesforce: 'Application_Language__c' },
      { custom_api: 'applicationSubmissionType', domain: 'application_submission_type', salesforce: 'Application_Submission_Type__c' },
      { custom_api: 'applicationSubmittedDate', domain: 'application_submitted_date', salesforce: 'Application_Submitted_Date__c' },
      { custom_api: 'appRTType', domain: '', salesforce: '' },
      { custom_api: '', domain: 'created_by', salesforce: 'CreatedBy' },
      { custom_api: 'didApplicantUseHousingCounselingAgency', domain: '', salesforce: 'Applicant_used_housing_counseling_agency__c' },
      { custom_api: 'externalSessionId', domain: '', salesforce: 'Third_Party_External_ID__c' },
      { custom_api: 'finalHouseholdIncome', domain: '', salesforce: 'Final_Household_Income__c' },
      { custom_api: 'formMetadata', domain: '', salesforce: '' },
      { custom_api: '', domain: 'general_lottery', salesforce: 'General_Lottery__c' },
      { custom_api: '', domain: 'general_lottery_rank', salesforce: 'General_Lottery_Rank__c' },
      { custom_api: 'hasDevelopmentalDisability', domain: 'has_developmental_disability', salesforce: 'Has_DevelopmentalDisability__c' },
      { custom_api: 'hasMilitaryService', domain: 'has_military_service', salesforce: 'Has_Military_Service__c' },
      { custom_api: 'hasPublicHousing', domain: '', salesforce: '' },
      { custom_api: 'hasSenior', domain: 'reserved_senior', salesforce: 'Reserved_Senior__c' },
      { custom_api: 'HHTotalIncomeWithAssets', domain: 'hh_total_income_with_assets_annual', salesforce: 'HH_Total_Income_with_Assets_Annual__c' },
      { custom_api: 'householdAssets', domain: 'household_assets', salesforce: 'Household_Assets__c' },
      { custom_api: 'householdVouchersSubsidies', domain: 'housing_voucher_or_subsidy', salesforce: 'Housing_Voucher_or_Subsidy__c' },
      { custom_api: 'housingCounselingAgency', domain: '', salesforce: 'Which_One__c' },
      { custom_api: 'id', domain: 'id', salesforce: 'Id' },
      { custom_api: 'interviewScheduledDate', domain: '', salesforce: 'Interview_Scheduled_Date__c' },
      { custom_api: '', domain: 'is_lottery_complete', salesforce: 'Is_Lottery_Complete__c' },
      { custom_api: 'listingID', domain: '', salesforce: 'Listing__c' },
      { custom_api: 'lotteryNumber', domain: 'lottery_number', salesforce: 'Lottery_Number__c' },
      { custom_api: 'lotteryNumberManual', domain: 'lottery_number_manual', salesforce: 'Lottery_Number_Manual__c' },
      { custom_api: 'monthlyIncome', domain: 'monthly_income', salesforce: 'Monthly_Income__c' },
      { custom_api: 'name', domain: 'name', salesforce: 'Name' },
      { custom_api: 'numberOfDependents', domain: 'number_of_dependents', salesforce: 'Number_of_Dependents__c' },
      { custom_api: 'otherHousingCounselingAgency', domain: '', salesforce: 'Other__c' },
      { custom_api: 'primaryApplicantContact', domain: 'primary_applicant_contact', salesforce: 'Primary_Applicant__c' },
      { custom_api: 'processingStatus', domain: 'processing_status', salesforce: 'Processing_Status__c' },
      { custom_api: 'referral', domain: 'referral_source', salesforce: 'Referral_Source__c' },
      { custom_api: 'snapshotId', domain: '', salesforce: 'Snapshot_ID__c' },
      { custom_api: 'status', domain: 'status', salesforce: 'Status__c' },
      { custom_api: '', domain: 'status_last_updated', salesforce: 'Status_Last_Updated__c' },
      { custom_api: 'subStatus', domain: 'sub_status', salesforce: 'Sub_Status__c' },
      { custom_api: '', domain: 'total_household_size', salesforce: 'Total_Household_Size__c' },
      { custom_api: 'totalMonthlyRent', domain: 'total_monthly_rent', salesforce: 'Total_Monthly_Rent__c' },
    ].freeze
  end
end
