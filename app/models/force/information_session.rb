# frozen_string_literal: true

module Force
  # Represents an information session object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for listings.
  class InformationSession < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'city', salesforce: 'City' },
      { domain: 'date', salesforce: 'Date' },
      { domain: 'end_time', salesforce: 'End_Time' },
      { domain: 'start_time', salesforce: 'Start_Time' },
      { domain: 'street_address', salesforce: 'Street_Address' },
      { domain: 'venue', salesforce: 'Venue' },
    ].freeze
  end
end
