# frozen_string_literal: true

module Force
  # Represent a flagged record set object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for flagged record sets.
  class FlaggedRecordSet < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'rule_name', salesforce: 'Rule_Name' },
      { domain: 'total_number_of_pending_review', salesforce: 'Total_Number_of_Pending_Review' },
      { domain: 'total_number_of_appealed', salesforce: 'Total_Number_of_Appealed' },
      { domain: 'total_number_of_duplicates', salesforce: 'Total_Number_of_Duplicates' },
      { domain: 'listing', salesforce: 'Listing' },
    ].freeze

    def to_salesforce
      salesforce_fields = super

      if salesforce_fields.key?('Listing')
        salesforce_fields.Listing = Force::Listing.from_domain(salesforce_fields.Listing).to_salesforce
      end

      salesforce_fields
    end

    def to_domain
      domain_fields = super

      if domain_fields.key?('listing')
        domain_fields.listing = Force::Listing.from_salesforce(domain_fields.listing).to_domain
      end

      domain_fields
    end
  end
end
