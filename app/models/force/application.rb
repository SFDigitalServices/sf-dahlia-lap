# frozen_string_literal: true

# TODO: Re-enable Rubocop's line length check on this file once
# we have settled on a format for the field mapping items
# rubocop:disable Metrics/LineLength
module Force
  # Represent an application object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for applications.
  class Application < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { custom_api: 'adaPrioritiesSelected', domain: 'has_ada_priorities_selected', salesforce: 'Has_ADA_Priorities_Selected' },
      { custom_api: 'agreeToTerms', domain: 'terms_acknowledged', salesforce: 'Terms_Acknowledged' },
      { custom_api: 'annualIncome', domain: 'annual_income', salesforce: 'Annual_Income' },
      { custom_api: 'answeredCommunityScreening', domain: 'answered_community_screening', salesforce: 'Answered_Community_Screening' },
      { custom_api: 'applicationLanguage', domain: 'application_language', salesforce: 'Application_Language' },
      { custom_api: 'applicationSubmissionType', domain: 'application_submission_type', salesforce: 'Application_Submission_Type' },
      { custom_api: 'applicationSubmittedDate', domain: 'application_submitted_date', salesforce: 'Application_Submitted_Date' },
      { custom_api: 'appRTType', domain: '', salesforce: '' },
      { custom_api: '', domain: 'createdby', salesforce: 'CreatedBy' },
      { custom_api: 'didApplicantUseHousingCounselingAgency', domain: '', salesforce: 'Applicant_used_housing_counseling_agency' },
      { custom_api: 'externalSessionId', domain: '', salesforce: 'Third_Party_External_ID' },
      { custom_api: 'finalHouseholdIncome', domain: '', salesforce: 'Final_Household_Income' },
      { custom_api: 'formMetadata', domain: '', salesforce: '' },
      { custom_api: '', domain: 'general_lottery', salesforce: 'General_Lottery' },
      { custom_api: '', domain: 'general_lottery_rank', salesforce: 'General_Lottery_Rank' },
      { custom_api: 'hasDevelopmentalDisability', domain: 'has_developmental_disability', salesforce: 'Has_DevelopmentalDisability' },
      { custom_api: 'hasMilitaryService', domain: 'has_military_service', salesforce: 'Has_Military_Service' },
      { custom_api: 'hasPublicHousing', domain: '', salesforce: '' },
      { custom_api: 'hasSenior', domain: 'reserved_senior', salesforce: 'Reserved_Senior' },
      { custom_api: 'HHTotalIncomeWithAssets', domain: 'hh_total_income_with_assets_annual', salesforce: 'HH_Total_Income_with_Assets_Annual' },
      { custom_api: 'householdAssets', domain: 'household_assets', salesforce: 'Household_Assets' },
      { custom_api: 'householdVouchersSubsidies', domain: 'housing_voucher_or_subsidy', salesforce: 'Housing_Voucher_or_Subsidy' },
      { custom_api: 'housingCounselingAgency', domain: '', salesforce: 'Which_One' },
      { custom_api: 'id', domain: 'id', salesforce: 'Id' },
      { custom_api: 'interviewScheduledDate', domain: '', salesforce: 'Interview_Scheduled_Date' },
      { custom_api: '', domain: 'is_lottery_complete', salesforce: 'Is_Lottery_Complete' },
      { custom_api: 'listingID', domain: '', salesforce: 'Listing' },
      { custom_api: 'lotteryNumber', domain: 'lottery_number', salesforce: 'Lottery_Number' },
      { custom_api: 'lotteryNumberManual', domain: 'lottery_number_manual', salesforce: 'Lottery_Number_Manual' },
      { custom_api: 'monthlyIncome', domain: 'monthly_income', salesforce: 'Monthly_Income' },
      { custom_api: 'name', domain: 'name', salesforce: 'Name' },
      { custom_api: 'numberOfDependents', domain: 'number_of_dependents', salesforce: 'Number_of_Dependents' },
      { custom_api: 'numberOfSeniors', domain: 'number_of_seniors', salesforce: 'Number_of_Seniors' },
      { custom_api: 'numberOfMinors', domain: 'number_of_minors', salesforce: 'Number_of_Minors' },
      { custom_api: 'otherHousingCounselingAgency', domain: '', salesforce: 'Other' },
      { custom_api: 'primaryApplicantContact', domain: 'primary_applicant_contact', salesforce: 'Primary_Applicant' },
      { custom_api: 'processingStatus', domain: 'processing_status', salesforce: 'Processing_Status' },
      { custom_api: 'referral', domain: 'referral_source', salesforce: 'Referral_Source' },
      { custom_api: 'snapshotId', domain: '', salesforce: 'Snapshot_ID' },
      { custom_api: 'status', domain: 'status', salesforce: 'Status' },
      { custom_api: '', domain: 'status_last_updated', salesforce: 'Status_Last_Updated' },
      { custom_api: 'subStatus', domain: 'sub_status', salesforce: 'Sub_Status' },
      { custom_api: '', domain: 'total_household_size', salesforce: 'Total_Household_Size' },
      { custom_api: 'totalMonthlyRent', domain: 'total_monthly_rent', salesforce: 'Total_Monthly_Rent' },
    ].freeze

    def to_domain
      domain_fields = super

      # Special field conversion cases for applications
      existing_fields = @fields[:salesforce].presence || @fields[:custom_api].presence
      if existing_fields.present?
        # ADA priorities
        ada_value = existing_fields['Has_ADA_Priorities_Selected'] || existing_fields['adaPrioritiesSelected']
        if ada_value
          ada_arr = ada_value.split(';')
          ada_hash = ada_arr.map { |x| [x.parameterize(separator: '_'), true] }.to_h
          domain_fields['has_ada_priorities_selected'] = ada_hash
        end

        # Created by
        domain_fields['createdby'] = { name: existing_fields['CreatedBy']['Name'] } if existing_fields['CreatedBy']
      end

      domain_fields
    end

    # TODO: There is code somewhere in this app that causes the Salesforce field
    # names we use in SOQL queries to have the "__c" suffix automatically added
    # onto them. That forces the field mappings in these Force objects to use
    # Salesforce field names without that suffix. That in turn causes issues
    # when trying to use the field mappings to translate to Salesforce fields
    # for REST API calls. Find and remove the code that strips out the "__c"
    # suffix, so that the Force objects' field mappings can contain true
    # Salesforce field names. Then remove this function as it won't be needed.
    def to_salesforce
      salesforce_fields = super
      add_salesforce_suffix(salesforce_fields)
    end
  end
end
# rubocop:enable Metrics/LineLength
