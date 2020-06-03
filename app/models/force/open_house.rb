# frozen_string_literal: true

module Force
  # Represents an open house object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for listings.
  class OpenHouse < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'date', salesforce: 'Date' },
      { domain: 'end_time', salesforce: 'End_Time' },
      { domain: 'start_time', salesforce: 'Start_Time' },
    ].freeze
  end
end
