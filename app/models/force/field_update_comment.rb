# frozen_string_literal: true

module Force
  class FieldUpdateComment < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'application', salesforce: 'Application' },
      { domain: 'comment', salesforce: 'Processing_Comment' },
      { domain: 'status', salesforce: 'Processing_Status' },
      { domain: 'date', salesforce: 'Processing_Date_Updated' },
      { domain: 'substatus', salesforce: 'Sub_Status' },
      { domain: 'timestamp', salesforce: 'Timestamp' },
    ].freeze

    def to_domain
      domain_fields = super

      domain_fields.timestamp = Date.new(domain_fields.date).to_time.to_i if domain_fields.date

      domain_fields
    end
  end
end