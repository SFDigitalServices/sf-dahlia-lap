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
      { custom_api: 'adaPrioritiesSelected', domain: 'has_ada_priorities_selected', salesforce: 'Has_ADA_Priorities_Selected', type: 'ada_priorities' },
      { custom_api: 'agreeToTerms', domain: 'terms_acknowledged', salesforce: 'Terms_Acknowledged' },
      { custom_api: 'annualIncome', domain: 'annual_income', salesforce: 'Annual_Income' },
      { custom_api: 'answeredCommunityScreening', domain: 'answered_community_screening', salesforce: 'Answered_Community_Screening' },
      { custom_api: 'applicationLanguage', domain: 'application_language', salesforce: 'Application_Language' },
      { custom_api: 'applicationSubmissionType', domain: 'application_submission_type', salesforce: 'Application_Submission_Type' },
      { custom_api: 'applicationSubmittedDate', domain: 'application_submitted_date', salesforce: 'Application_Submitted_Date' },
      { custom_api: 'appRTType', domain: '', salesforce: '' },
      { custom_api: '', domain: 'createdby', salesforce: 'CreatedBy' },
      { custom_api: '', domain: 'createddate', salesforce: 'CreatedDate' },
      { custom_api: 'didApplicantUseHousingCounselingAgency', domain: '', salesforce: 'Applicant_used_housing_counseling_agency' },
      { custom_api: 'externalSessionId', domain: '', salesforce: 'Third_Party_External_ID' },
      { custom_api: 'finalHouseholdIncome', domain: '', salesforce: 'Final_Household_Income' },
      { custom_api: 'formMetadata', domain: '', salesforce: '' },
      { custom_api: '', domain: 'general_lottery', salesforce: 'General_Lottery' },
      { custom_api: '', domain: 'general_lottery_rank', salesforce: 'General_Lottery_Rank' },
      { custom_api: '', domain: 'unsorted_lottery_rank', salesforce: 'Lottery_Rank' },
      { custom_api: 'hasCompletedHomebuyerEducation', domain: 'has_completed_homebuyer_education', salesforce: '?' },
      { custom_api: 'hasDevelopmentalDisability', domain: 'has_developmental_disability', salesforce: 'Has_DevelopmentalDisability' },
      { custom_api: 'hasLoanPreapproval', domain: 'has_loan_preapproval', salesforce: '?' },
      { custom_api: 'hasMilitaryService', domain: 'has_military_service', salesforce: 'Has_Military_Service' },
      { custom_api: 'hasPublicHousing', domain: '', salesforce: '' },
      { custom_api: 'hasSenior', domain: 'reserved_senior', salesforce: 'Reserved_Senior' },
      { custom_api: 'householdVouchersSubsidies', domain: 'housing_voucher_or_subsidy', salesforce: 'Housing_Voucher_or_Subsidy' },
      { custom_api: 'housingCounselingAgency', domain: '', salesforce: 'Which_One' },
      { custom_api: 'id', domain: 'id', salesforce: 'Id' },
      { custom_api: 'isFirstTimeHomebuyer', domain: 'is_first_time_homebuyer', salesforce: '?' },
      { custom_api: 'interviewScheduledDate', domain: '', salesforce: 'Interview_Scheduled_Date' },
      { custom_api: 'lendingAgent', domain: 'lending_agent', salesforce: '?' },
      { custom_api: '', domain: 'listing', salesforce: 'Listing' },
      { custom_api: 'listingID', domain: 'listing_id', salesforce: '?' },
      { custom_api: 'lotteryNumber', domain: 'lottery_number', salesforce: 'Lottery_Number' },
      { custom_api: 'lotteryNumberManual', domain: 'lottery_number_manual', salesforce: 'Lottery_Number_Manual' },
      { custom_api: 'monthlyIncome', domain: 'monthly_income', salesforce: 'Monthly_Income' },
      { custom_api: 'name', domain: 'name', salesforce: 'Name' },
      { custom_api: 'otherHousingCounselingAgency', domain: '', salesforce: 'Other' },
      { custom_api: 'shortFormPreferences', domain: 'preferences', salesforce: '?' },
      { custom_api: 'primaryApplicantContact', domain: 'primary_applicant_contact', salesforce: 'Primary_Applicant' },
      { custom_api: 'referral', domain: 'referral_source', salesforce: 'Referral_Source' },
      { custom_api: 'snapshotId', domain: '', salesforce: 'Snapshot_ID' },
      { custom_api: '', domain: 'total_household_size', salesforce: 'Total_Household_Size' },
      { custom_api: 'totalMonthlyRent', domain: 'total_monthly_rent', salesforce: 'Total_Monthly_Rent' },
      { custom_api: 'isFirstTimeHomebuyer', domain: 'is_first_time_homebuyer', salesforce: 'Is_First_Time_Homebuyer' },
      { custom_api: 'hasCompletedHomebuyerEducation', domain: 'has_completed_homebuyer_education', salesforce: 'Has_Completed_Homebuyer_Education' },
      { custom_api: 'hasLoanPreapproval', domain: 'has_loan_preapproval', salesforce: 'Has_Loan_Pre_approval' },
      { custom_api: 'lendingAgent', domain: 'lending_agent', salesforce: 'Lending_Agent' },
      { custom_api: 'shortFormPreferences', domain: 'preferences', salesforce: '?', object: Force::Preference },
      { custom_api: 'primaryApplicant', domain: 'applicant', salesforce: '?', object: Force::ApplicationMember },
      { custom_api: 'alternateContact', domain: 'alternate_contact', salesforce: 'Alternate_Contact', object: Force::ApplicationMember },
      { custom_api: 'householdMembers', domain: 'household_members', salesforce: 'Household_Members', object: Force::ApplicationMember },
      { custom_api: '', domain: 'demographics', salesforce: '?', object: Force::Demographics },
      { custom_api: '', domain: 'applicant', salesforce: 'Applicant' },
      { custom_api: '', domain: 'listing_preference', salesforce: 'Listing_Preference_ID' },
      { custom_api: 'status', domain: 'status', salesforce: 'Status' },
      # Supplemental Application Fields
      { custom_api: '', domain: 'status_last_updated', salesforce: 'Status_Last_Updated' },
      { custom_api: 'amiChartType', domain: 'ami_chart_type', salesforce: 'AMI_Chart_Type' },
      { custom_api: 'amiChartYear', domain: 'ami_chart_year', salesforce: 'AMI_Chart_Year' },
      { custom_api: 'amiPercentage', domain: 'ami_percentage', salesforce: 'AMI_Percentage' },
      { custom_api: 'confirmedHouseholdAnnualIncome', domain: 'confirmed_household_annual_income', salesforce: 'Confirmed_Household_Annual_Income' },
      { custom_api: 'HHTotalIncomeWithAssets', domain: 'hh_total_income_with_assets_annual', salesforce: 'HH_Total_Income_with_Assets_Annual' },
      { custom_api: 'householdAssets', domain: 'household_assets', salesforce: 'Household_Assets' },
      { custom_api: 'imputedIncomeFromAssets', domain: 'imputed_income_from_assets', salesforce: 'Imputed_Income_from_Assets' },
      { custom_api: 'numberOfDependents', domain: 'number_of_dependents', salesforce: 'Number_of_Dependents' },
      { custom_api: 'numberOfMinors', domain: 'number_of_minors', salesforce: 'Number_of_Minors' },
      { custom_api: 'numberOfSeniors', domain: 'number_of_seniors', salesforce: 'Number_of_Seniors' },
      { custom_api: 'processingStatus', domain: 'processing_status', salesforce: 'Processing_Status' },
      { custom_api: 'subStatus', domain: 'sub_status', salesforce: 'Sub_Status' },
      { custom_api: '', domain: 'status_last_updated', salesforce: 'Processing_Date_Updated' },
      { custom_api: 'suppAppSignedDate', domain: 'supp_app_signed_date', salesforce: 'Supp_App_Signed_Date', type: 'date' },
      { custom_api: 'inviteToApplyDeadlineDate', domain: 'invite_to_apply_deadline_date', salesforce: 'Invite_To_Apply_Deadline_Date', type: 'date' },
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
        if existing_fields['householdMembers']
          domain_fields.household_members = Force::ApplicationMember.convert_list(existing_fields['householdMembers'], :from_custom_api, :to_domain)
        elsif existing_fields['Household_Members']
          domain_fields.household_members = Force::ApplicationMember.convert_list(existing_fields['Household_Members'], :from_salesforce, :to_domain)
        end

        if existing_fields['shortFormPreferences']
          domain_fields.preferences = Force::Preference.convert_list(existing_fields['shortFormPreferences'], :from_custom_api, :to_domain)
        end

        if domain_fields['alternate_contact'] && !domain_fields['alternate_contact'].values.all?(&:blank?)
          if existing_fields['Alternate_Contact']
            domain_fields.alternate_contact = Force::ApplicationMember.from_salesforce(domain_fields.alternate_contact).to_domain
          else existing_fields['alternateContact']
            domain_fields.alternate_contact = Force::ApplicationMember.from_custom_api(domain_fields.alternate_contact).to_domain
          end
        end
      end

      if domain_fields.applicant && (domain_fields.applicant.First_Name || domain_fields.applicant.firstName)
        if domain_fields.applicant.First_Name
          applicant_object = Force::ApplicationMember.from_salesforce(domain_fields.applicant)
        else
          applicant_object = Force::ApplicationMember.from_custom_api(domain_fields.applicant)
        end
        domain_fields.applicant = applicant_object.to_domain
        domain_fields.demographics = applicant_object.to_demographics_fields_domain
      end

      listingIsString = domain_fields.listing.is_a? String
      if domain_fields.listing && !listingIsString
        domain_fields.listing = Force::Listing.from_salesforce(domain_fields.listing).to_domain
        domain_fields.listing_id = domain_fields.listing.id
      end

      if domain_fields['supp_app_signed_date']
        supp_app_signed_date_string = domain_fields['supp_app_signed_date']
        domain_fields.supp_app_signed_date = self.class.date_to_json(supp_app_signed_date_string)
      end

      domain_fields
    end

    def to_custom_api
      custom_api_fields = super
      # Start with just from domain to API, then figure out if I want to have case for from SOQL in here too.
      domain_fields = @fields[:domain].presence
      return custom_api_fields unless domain_fields.present?

      # Convert preferences
      if domain_fields['preferences']
        api_preferences = []
        domain_fields['preferences'].each do |pref_fields|
          api_preferences << Force::Preference.from_domain(pref_fields).to_custom_api
        end
        custom_api_fields['shortFormPreferences'] = api_preferences
      end

      # Convert alt contact
      if domain_fields['alternate_contact']&.present? && !domain_fields['alternate_contact'].values.all?(&:blank?)
        custom_api_fields['alternateContact'] = Force::ApplicationMember.from_domain(domain_fields['alternate_contact']).to_custom_api
      else
        custom_api_fields['alternateContact'] = nil
      end

      # Convert hh members
      if domain_fields['household_members']
        hh_members = []
        domain_fields['household_members'].each do |hh_fields|
          hh_members << Force::ApplicationMember.from_domain(hh_fields).to_custom_api
        end
        custom_api_fields['householdMembers'] = hh_members
      end

      # Convert primary applicant
      primary_app_fields = domain_fields['applicant']&.merge(domain_fields['demographics'])
      custom_api_fields['primaryApplicant'] = Force::ApplicationMember.from_domain(primary_app_fields).to_custom_api

      custom_api_fields['listingID'] = domain_fields['listing_id']

      # ADA priorities need to be converted from a checklist to a string.
      ada_hash = domain_fields['has_ada_priorities_selected']
      if ada_hash
        ada_string = ada_hash.select { |_, v| v }.keys.map { |v| v.humanize.capitalize }.join(';')
        custom_api_fields['adaPrioritiesSelected'] = ada_string
      end

      # Convert array date into string
      if domain_fields['supp_app_signed_date']
        custom_api_fields['suppAppSignedDate'] = self.class.date_to_salesforce(domain_fields['supp_app_signed_date'])
      end
      custom_api_fields
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

      if salesforce_fields.Supp_App_Signed_Date && !salesforce_fields.Supp_App_Signed_Date.is_a?(String)
        salesforce_fields.Supp_App_Signed_Date = self.class.json_to_date(salesforce_fields.Supp_App_Signed_Date)
      end

      add_salesforce_suffix(salesforce_fields)
    end
  end
end
# rubocop:enable Metrics/LineLength
