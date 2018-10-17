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
      { custom_api: 'appMemberID', domain: '', salesforce: 'Application_Member__c' },
      { custom_api: 'certificateNumber', domain: 'certificate_number', salesforce: 'Certificate_Number' },
      { custom_api: 'city', domain: 'city', salesforce: 'City' },
      { custom_api: 'id', domain: 'id', salesforce: 'Id' },
      { custom_api: 'individualPreference', domain: 'individual_preference', salesforce: 'Individual_preference' },
      { custom_api: 'listingPreferenceID', domain: 'listing_preference_id', salesforce: 'Listing_Preference_ID' },
      { custom_api: '', domain: 'lottery_status', salesforce: 'Lottery_Status' },
      { custom_api: 'lwPreferenceProof', domain: 'lw_type_of_proof', salesforce: 'LW_Type_of_Proof' },
      { custom_api: '', domain: 'name', salesforce: 'Name' },
      { custom_api: 'optOut', domain: 'opt_out', salesforce: 'Opt_Out' },
      { custom_api: '', domain: 'person_who_claimed_name', salesforce: 'Person_who_claimed_Name' },
      { custom_api: 'postLotteryValidation', domain: 'post_lottery_validation', salesforce: 'Post_Lottery_Validation' },
      { custom_api: '', domain: 'preference_lottery_rank', salesforce: 'Preference_Lottery_Rank' },
      { custom_api: '', domain: 'preference_name', salesforce: 'Preference_Name' },
      { custom_api: '', domain: 'preference_order', salesforce: 'Preference_Order' },
      { custom_api: 'preferenceProof', domain: 'type_of_proof', salesforce: 'Type_of_Proof' },
      { custom_api: '', domain: 'receives_preference', salesforce: 'Receives_Preference' },
      { custom_api: 'recordTypeDevName', domain: 'recordtype_developername', salesforce: 'RecordType.DeveloperName' },
      { custom_api: 'state', domain: 'state', salesforce: 'State' },
      { custom_api: '', domain: 'total_household_rent', salesforce: 'Total_Household_Rent' },
      { custom_api: 'zip', domain: 'zip_code', salesforce: 'Zip_Code' },
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

      # Special field conversion cases for preferences
      if attributes.RecordType
        preference.fields.salesforce['RecordType.DeveloperName'] = attributes.RecordType.DeveloperName
        preference.fields.salesforce.delete 'RecordType'
      end

      preference
    end

    def to_domain
      domain_fields = super

      # Special field conversion cases for preferences
      if domain_fields.total_household_rent
        domain_fields.total_household_rent = domain_fields.total_household_rent.to_s
      end

      # Add preference name if it isn't already present
      if !domain_fields.preference_name && @fields.salesforce.empty?
        recordtype_developername = @fields.custom_api.recordTypeDevName
        preference_type = PREFERENCE_TYPES.find do |t|
          t[:recordtype_developername] == recordtype_developername
        end
        domain_fields.preference_name = preference_type[:name] if preference_type
      end

      domain_fields
    end
  end
end
