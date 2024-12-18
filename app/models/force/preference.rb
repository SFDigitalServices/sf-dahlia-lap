# frozen_string_literal: true

module Force
  # Represent a preference object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for preferences.
  class Preference < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { custom_api: 'address', domain: 'street', salesforce: 'Street' },
      { custom_api: '', domain: 'application_member', salesforce: 'Application_Member' },
      { custom_api: 'appMemberID', domain: 'application_member_id', salesforce: 'Application_Member.Id' },
      { custom_api: '', domain: 'application', salesforce: 'Application' },
      { custom_api: 'certificateNumber', domain: 'certificate_number', salesforce: 'Certificate_Number' },
      { custom_api: 'city', domain: 'city', salesforce: 'City' },
      { custom_api: 'shortformPreferenceID', domain: 'id', salesforce: 'Id' },

      # Individual_preference has a lowercase 'p' on purpose.
      { custom_api: 'individualPreference', domain: 'individual_preference', salesforce: 'Individual_preference' },

      # TODO: Split this into two fields, the String Listing_Preference_ID__c version, and the hash Listing_Preference_ID__r version.
      { custom_api: 'listingPreferenceID', domain: 'listing_preference_id', salesforce: 'Listing_Preference_ID' },
      { custom_api: '', domain: 'lottery_status', salesforce: 'Lottery_Status' },
      { custom_api: 'lwPreferenceProof', domain: 'lw_type_of_proof', salesforce: 'LW_Type_of_Proof' },
      { custom_api: '', domain: 'name', salesforce: 'Name' },
      { custom_api: 'naturalKey', domain: 'naturalKey', salesforce: '' },
      { custom_api: 'optOut', domain: 'opt_out', salesforce: 'Opt_Out' },
      { custom_api: '', domain: 'person_who_claimed_name', salesforce: 'Person_who_claimed_Name' },
      { custom_api: 'postLotteryValidation', domain: 'post_lottery_validation', salesforce: 'Post_Lottery_Validation' },
      { custom_api: '', domain: 'preference_lottery_rank', salesforce: 'Preference_Lottery_Rank' },
      { custom_api: '', domain: 'preference_name', salesforce: 'Preference_Name' },
      { custom_api: '', domain: 'preference_all_lottery_rank', salesforce: 'Preference_All_Lottery_Rank' },
      { custom_api: '', domain: '', salesforce: 'Preference_All_Name' },
      { custom_api: '', domain: 'preference_order', salesforce: 'Preference_Order' },
      { custom_api: 'preferenceProof', domain: 'type_of_proof', salesforce: 'Type_of_proof' },
      { custom_api: '', domain: 'veteran_type_of_proof', salesforce: 'Veteran_Type_of_Proof' },
      { custom_api: '', domain: 'receives_preference', salesforce: 'Receives_Preference' },
      { custom_api: 'recordTypeDevName', domain: 'recordtype_developername', salesforce: 'RecordType.DeveloperName' },
      { custom_api: '', domain: 'record_type_for_app_preferences', salesforce: 'Listing_Preference_ID.Record_Type_For_App_Preferences' },
      { custom_api: '', domain: 'custom_preference_type', salesforce: 'Custom_Preference_Type' },
      { custom_api: 'state', domain: 'state', salesforce: 'State' },
      { custom_api: '', domain: 'total_household_rent', salesforce: 'Total_Household_Rent' },
      { custom_api: '', domain: 'custom_preference_type', salesforce: 'Custom_Preference_Type' },
      { custom_api: 'zip', domain: 'zip_code', salesforce: 'Zip_Code' },
      { custom_api: '', domain: 'layered_preference_validation', salesforce: 'Layered_Preference_Validation' },
    ].freeze

    PREFERENCE_TYPES = [
      { name: 'Certificate of Preference (COP)', recordtype_developername: 'COP' },
      { name: 'Displaced Tenant Housing Preference (DTHP)', recordtype_developername: 'DTHP' },
      { name: 'Neighborhood Resident Housing Preference (NRHP)', recordtype_developername: 'NRHP' },
      { name: 'Live or Work in San Francisco Preference', recordtype_developername: 'L_W' },
      { name: 'Anti-Displacement Housing Preference (ADHP)', recordtype_developername: 'ADHP' },
      { name: 'Rent Burdened / Assisted Housing Preference', recordtype_developername: 'RB_AHP' },
      { name: 'Alice Griffith Housing Development Resident', recordtype_developername: 'AG' },
      { name: 'Custom', recordtype_developername: 'Custom' },
    ].freeze

    def self.from_salesforce(attributes)
      preference = super

      fields = preference.fields.salesforce

      # Special field conversion cases for preferences
      if fields.RecordType
        preference.fields.salesforce['RecordType.DeveloperName'] = fields.RecordType.DeveloperName
        preference.fields.salesforce.delete 'RecordType'
      end

      # Listing_Preference_ID actually refers to both Listing_Preference_ID__r and Listing_Preference_ID__c
      if fields.Listing_Preference_ID && !fields.Listing_Preference_ID.is_a?(String)
        preference.fields.salesforce['Listing_Preference_ID.Record_Type_For_App_Preferences'] =
          fields.Listing_Preference_ID.Record_Type_For_App_Preferences
        preference.fields.salesforce.delete 'Listing_Preference_ID'
      end

      preference.fields.salesforce['Application_Member.Id'] = fields.Application_Member.Id if fields.Application_Member

      preference
    end

    def to_domain
      domain_fields = super

      # Special field conversion cases for preferences
      domain_fields.total_household_rent = domain_fields.total_household_rent.to_s if domain_fields.total_household_rent

      unless domain_fields.preference_name
        if @fields.salesforce.Preference_All_Name
          domain_fields.preference_name = @fields.salesforce.Preference_All_Name
        elsif @fields.salesforce.empty?
          recordtype_developername = @fields.custom_api.recordTypeDevName
          preference_type = PREFERENCE_TYPES.find do |t|
            t[:recordtype_developername] == recordtype_developername
          end
          domain_fields.preference_name = preference_type[:name] if preference_type
        end
      end

      if domain_fields.application_member
        domain_fields.application_member = Force::ApplicationMember.from_salesforce(domain_fields.application_member).to_domain
      end

      domain_fields.application = Force::Application.from_salesforce(domain_fields.application).to_domain if domain_fields.application

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
      is_from_domain = @fields.domain.present?

      if salesforce_fields['Application_Member.Id']
        salesforce_fields['Application_Member'] = salesforce_fields['Application_Member.Id']
        salesforce_fields.delete 'Application_Member.Id'
      end

      add_salesforce_suffix(salesforce_fields)
    end
  end
end
