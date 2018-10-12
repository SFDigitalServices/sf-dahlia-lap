module Force
  # Represent an application object. Provide mapping between SOQL API
  # and LAP domain field names for applications.
  class Application < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { salesforce: 'Id', domain: 'id' },
      # { salesforce: 'Total_Monthly_Rent__c', domain: 'total_monthly_rent' },
      { salesforce: 'Primary_Applicant', domain: 'primary_applicant_contact' },
      { salesforce: 'Name', domain: 'name' },
      { salesforce: 'Status', domain: 'status' },
      { salesforce: 'Total_Household_Size', domain: 'total_household_size' },
      { salesforce: 'Application_Submission_Type', domain: 'application_submission_type' },
      { salesforce: 'Application_Submitted_Date', domain: 'application_submitted_date' },
      { salesforce: 'Annual_Income', domain: 'annual_income' },
      { salesforce: 'HH_Total_Income_with_Assets_Annual', domain: 'hh_total_income_with_assets_annual' },
      { salesforce: 'Household_Assets', domain: 'household_assets' },
      { salesforce: 'Monthly_Income', domain: 'monthly_income' },
      { salesforce: 'Is_Lottery_Complete', domain: 'is_lottery_complete' },
      { salesforce: 'Housing_Voucher_or_Subsidy', domain: 'housing_voucher_or_subsidy' },
      { salesforce: 'Referral_Source', domain: 'referral_source' },
      { salesforce: 'Application_Language', domain: 'application_language' },
      { salesforce: 'Lottery_Number_Manual', domain: 'lottery_number_manual' },
      { salesforce: 'Lottery_Number', domain: 'lottery_number' },
      { salesforce: 'Total_Monthly_Rent', domain: 'total_monthly_rent' },
      { salesforce: 'General_Lottery', domain: 'general_lottery' },
      { salesforce: 'General_Lottery_Rank', domain: 'general_lottery_rank' },
      { salesforce: 'Answered_Community_Screening', domain: 'answered_community_screening' },
      { salesforce: 'Has_Military_Service', domain: 'has_military_service' },
      { salesforce: 'Has_DevelopmentalDisability', domain: 'has_developmental_disability' },
      { salesforce: 'Terms_Acknowledged', domain: 'terms_acknowledged' },
      { salesforce: 'Number_of_Dependents', domain: 'number_of_dependents' },
      { salesforce: 'Processing_Status', domain: 'processing_status' },
      { salesforce: 'Status_Last_Updated', domain: 'status_last_updated' },
      { salesforce: 'Reserved_Senior', domain: 'reserved_senior' },
      { salesforce: 'Applicant', domain: 'applicant', mapper: Applicant },
      { salesforce: 'preferences', domain: 'preferences', array: Preference },
    ].freeze
  end
end
