# frozen_string_literal: true

module Force
  # Represent a rental assistance object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for rental assistances.
  class RentalAssistance < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'assistance_amount', salesforce: 'Assistance_Amount__c' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'lease', salesforce: 'Lease__c' },
      { domain: 'other_assistance_name', salesforce: 'Other_Assistance_Name__c' },
      { domain: 'recipient', salesforce: 'Household_Member__c' },
      { domain: 'recurring_assistance', salesforce: 'Recurring_Assistance__c' },
      { domain: 'type_of_assistance', salesforce: 'Type_of_Assistance__c' },
    ].freeze

    def to_domain
      domain_fields = super
      float_to_currency('assistance_amount', domain_fields)

      domain_fields
    end

    def to_salesforce
      salesforce_fields = super
      currency_to_float('Assistance_Amount__c', salesforce_fields)

      salesforce_fields
    end
  end
end
