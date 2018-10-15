module Force
  # Represent a preference object. Provide mapping between SOQL API
  # and LAP domain field names for preferences.
  class Preference < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { salesforce: 'Id', domain: 'id' },
      { salesforce: 'Individual_preference__c', domain: 'individual_preference' },
      { salesforce: 'Post_Lottery_Validation__c', domain: 'post_lottery_validation' },
      { salesforce: 'Type_of_Proof__c', domain: 'type_of_proof' },
      { salesforce: 'Id', domain: 'id' },
      { salesforce: 'Name', domain: 'name' },
      { salesforce: 'Preference_Name', domain: 'preference_name' },
      { salesforce: 'Person_who_claimed_Name', domain: 'person_who_claimed_name' },
      { salesforce: 'Type_of_proof', domain: 'type_of_proof' },
      { salesforce: 'LW_Type_of_Proof', domain: 'lw_type_of_proof' },
      { salesforce: 'Opt_Out', domain: 'opt_out' },
      { salesforce: 'Lottery_Status', domain: 'lottery_status' },
      { salesforce: 'Post_Lottery_Validation', domain: 'post_lottery_validation' },
      { salesforce: 'Preference_Lottery_Rank', domain: 'preference_lottery_rank' },
      { salesforce: 'Listing_Preference_ID', domain: 'listing_preference_id' },
      { salesforce: 'Receives_Preference', domain: 'receives_preference' },
      { salesforce: 'Individual_preference', domain: 'individual_preference' },
      { salesforce: 'Certificate_Number', domain: 'certificate_number' },
      { salesforce: 'Preference_Order', domain: 'preference_order' },
      { salesforce: 'City', domain: 'city' },
      { salesforce: 'State', domain: 'state' },
      { salesforce: 'Zip_Code', domain: 'zip_code' },
      { salesforce: 'Street', domain: 'street' },
      {
        salesforce: {
          field: 'Total_Household_Rent',
          fetch: proc { |value| value.to_s },
        },
        domain: 'total_household_rent',
      },
      { salesforce: proc { |record| record['RecordType']['DeveloperName'] }, domain: 'recordtype_developername' },
      {
        salesforce: {
          field: 'Listing_Preference_ID',
          fetch: proc { |_| {} },
        },
        domain: 'listing_preference',
      },
    ].freeze
  end
end
