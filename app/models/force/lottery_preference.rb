# frozen_string_literal: true

module Force
  # Represents a single unit object. Provide mapping between
  # Salesforce object field names and LAP domain field names for listings.
  class LotteryPreference < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'total_submitted_apps', salesforce: 'Total_Submitted_Apps' },
      { domain: 'order', salesforce: 'Order' },
      { domain: 'description', salesforce: 'Description' },
      { domain: 'available_units', salesforce: 'Available_Units' },
      { domain: 'pdf_url', salesforce: 'PDF_URL' },
      { domain: 'lottery_preference', salesforce: 'Lottery_Preference' },
    ].freeze

    def to_domain
      domain_fields = super

      domain_fields.lottery_preference = {
        id: domain_fields[:lottery_preference][:Id],
        name: domain_fields[:lottery_preference][:Name],
      }
      domain_fields
    end

    def to_salesforce
      salesforce_fields = super

      salesforce_fields.Lottery_Preference = {
        Id: salesforce_fields[:Lottery_Preference][:id],
        Name: salesforce_fields[:Lottery_Preference][:name],
      }
      salesforce_fields
    end
  end
end
