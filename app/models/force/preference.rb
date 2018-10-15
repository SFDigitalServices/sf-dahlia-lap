module Force
  # Represent a preference object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for preferences.
  class Preference < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { domain: 'certificate_number', salesforce: 'Certificate_Number__c' },
      { domain: 'city', salesforce: 'City__c' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'individual_preference', salesforce: 'Individual_preference__c' },
      { domain: 'listing_preference_id', salesforce: 'Listing_Preference_ID__c' },
      { domain: 'lottery_status', salesforce: 'Lottery_Status__c' },
      { domain: 'lw_type_of_proof', salesforce: 'LW_Type_of_Proof__c' },
      { domain: 'name', salesforce: 'Name' },
      { domain: 'opt_out', salesforce: 'Opt_Out__c' },
      { domain: 'person_who_claimed_name', salesforce: 'Person_who_claimed_Name__c' },
      { domain: 'post_lottery_validation', salesforce: 'Post_Lottery_Validation__c' },
      { domain: 'preference_lottery_rank', salesforce: 'Preference_Lottery_Rank__c' },
      { domain: 'preference_name', salesforce: 'Preference_Name__c' },
      { domain: 'preference_order', salesforce: 'Preference_Order__c' },
      { domain: 'receives_preference', salesforce: 'Receives_Preference__c' },
      { domain: 'recordtype_developername', salesforce: 'RecordType.DeveloperName' },
      { domain: 'state', salesforce: 'State__c' },
      { domain: 'street', salesforce: 'Street__c' },
      { domain: 'total_household_rent', salesforce: 'Total_Household_Rent__c' },
      { domain: 'type_of_proof', salesforce: 'Type_of_Proof__c' },
      { domain: 'zip_code', salesforce: 'Zip_Code__c' },
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
