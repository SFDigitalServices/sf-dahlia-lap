module Force
  # Represent a preference object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for preferences.
  class Preference < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { custom_api: '', domain: 'certificate_number', salesforce: 'Certificate_Number__c' },
      { custom_api: '', domain: 'city', salesforce: 'City__c' },
      { custom_api: 'id', domain: 'id', salesforce: 'Id' },
      { custom_api: '', domain: 'individual_preference', salesforce: 'Individual_preference__c' },
      { custom_api: '', domain: 'listing_preference_id', salesforce: 'Listing_Preference_ID__c' },
      { custom_api: '', domain: 'lottery_status', salesforce: 'Lottery_Status__c' },
      { custom_api: '', domain: 'lw_type_of_proof', salesforce: 'LW_Type_of_Proof__c' },
      { custom_api: '', domain: 'name', salesforce: 'Name' },
      { custom_api: '', domain: 'opt_out', salesforce: 'Opt_Out__c' },
      { custom_api: '', domain: 'person_who_claimed_name', salesforce: 'Person_who_claimed_Name__c' },
      { custom_api: '', domain: 'post_lottery_validation', salesforce: 'Post_Lottery_Validation__c' },
      { custom_api: '', domain: 'preference_lottery_rank', salesforce: 'Preference_Lottery_Rank__c' },
      { custom_api: '', domain: 'preference_name', salesforce: 'Preference_Name__c' },
      { custom_api: '', domain: 'preference_order', salesforce: 'Preference_Order__c' },
      { custom_api: '', domain: 'receives_preference', salesforce: 'Receives_Preference__c' },
      { custom_api: '', domain: 'recordtype_developername', salesforce: 'RecordType.DeveloperName' },
      { custom_api: '', domain: 'state', salesforce: 'State__c' },
      { custom_api: '', domain: 'street', salesforce: 'Street__c' },
      { custom_api: '', domain: 'total_household_rent', salesforce: 'Total_Household_Rent__c' },
      { custom_api: 'preferenceProof', domain: 'type_of_proof', salesforce: 'Type_of_Proof__c' },
      { custom_api: 'zip', domain: 'zip_code', salesforce: 'Zip_Code__c' },
    ].freeze

    def self.from_salesforce(attributes)
      preference = super

      # Special field conversion cases for preferences
      preference.fields[:salesforce]['RecordType.DeveloperName'] = attributes.RecordType.DeveloperName
      preference.fields[:salesforce].delete 'RecordType'

      preference
    end

    def to_domain
      fields = super

      # Special field conversion cases for preferences
      fields['total_household_rent'] = fields['total_household_rent'].to_s if fields['total_household_rent']

      fields
    end
  end
end
