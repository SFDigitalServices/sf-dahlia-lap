module Force
  # encapsulate all Salesforce Short Form Application querying functions
  class UnitsService < Force::Base
    DRAFT = 'Draft'.freeze
    FIELD_NAME = :units
    FIELDS = load_fields(FIELD_NAME).freeze

    def available_units_by_listing(listing_id)
      # assigned_units = assinged_units_by_listing(listing_id)
      # unit_ids = assigned_units.records.map { |a| a.try(:Unit) }.compact
      #
      # q = builder.from(:Unit__c)
      # .select('Id')
      # .where_eq('Listing__c', "'#{listing_id}'")
      # .transform_results { |results| massage(results) }
      #
      # if unit_ids.present?
      #   q.where_not_in(:Id, assigned_units.map { |a| a.try(:Unit) }.compact)
      # end
      #
      # q.query

      # SELECT Id, Unit_Number__c FROM Unit__c
      # WHERE Listing__c = 'a0W0P00000BxWE3' AND
      # Id NOT IN (SELECT Unit__c FROM Lease__c WHERE Application__r.Listing__c = 'a0W0P00000BxWE3')

      sub_query = builder.from(:Lease__c).select(:Unit__c).where_eq('Application__r.Listing__c', listing_id, :string).to_soql

      builder.from(:Unit__c)
             .select('Id, Unit_Number__c ')
             .where_eq('Listing__c', listing_id, :string)
             .where("Id NOT IN (#{sub_query})")
             .transform_results { |results| massage(results) }
             .query
    end

    def assinged_units_by_listing(listing_id)
      builder.from(:Lease__c)
             .select('Id, Unit__c')
             .where_eq('Application__r.Listing__c', "'#{listing_id}'")
             .transform_results { |results| massage(results) }
             .query
    end
  end
end
