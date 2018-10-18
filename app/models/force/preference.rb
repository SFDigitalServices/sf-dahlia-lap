# frozen_string_literal: true

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
    ].freeze
  end
end
