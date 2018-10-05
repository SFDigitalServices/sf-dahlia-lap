module Force
  # Represent a preference object. Provide mapping between SOQL API
  # and LAP domain field names for preferences.
  class Preference < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { soql: 'Id', domain: 'id' },
      { soql: 'Individual_preference__c', domain: 'individual_preference' },
      { soql: 'Post_Lottery_Validation__c', domain: 'post_lottery_validation' },
      { soql: 'Type_of_Proof__c', domain: 'type_of_proof' },
    ].freeze
  end
end
