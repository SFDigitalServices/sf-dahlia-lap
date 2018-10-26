module Force
  class RentalAssistance < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'type_of_assistance', salesforce: 'Type_of_Assistance' },
      { domain: 'recurring_assistance', salesforce: 'Recurring_Assistance' },
      { domain: 'assistance_amount', salesforce: 'Assistance_Amount' },
      { domain: 'recipient', salesforce: 'Recurring_Assistance' },
    ].freeze
  end
end
