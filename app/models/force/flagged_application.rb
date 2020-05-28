# frozen_string_literal: true

module Force
  class FlaggedApplication < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'review_status', salesforce: 'Review_Status' },
      { domain: 'comments', salesforce: 'Comments' },
    ].freeze

    def to_salesforce_with_suffix
      salesforce_fields = to_salesforce()
      add_salesforce_suffix(salesforce_fields)
    end
  end
end