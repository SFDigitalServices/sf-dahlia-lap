# frozen_string_literal: true

module Force
  # Encapsulate all Salesforce Short Form Application querying functions
  class UnitsService < Force::Base
    DRAFT = 'Draft'
    FIELD_NAME = :units
    FIELDS = load_fields(FIELD_NAME).freeze

    # Returns units and relevant lease information for specified listing.
    # Units contain info about unit number + eligibility. We join
    # this with info from Leases
    def units_and_leases_for_listing(listing_id)
      lease_query = builder.from(:Leases__r)
                         .select('Application__c, Lease_Status__c, Preference_Used_Name__c')
                         .to_soql

      result = builder.from(:Unit__c)
             .select("Id, Priority_Type__c, AMI_chart_type__c, Max_AMI_for_Qualifying_Unit__c, Unit_Number__c, Unit_Type__c, AMI_chart_year__c, Status__c, (#{lease_query})")
             .where_eq('Listing__c', listing_id, :string)
             .transform_results { |results| massage(results) }
             .query
             .records

      #format/convert unit and lease objects
      domain_units = result.map do |unit|
        domain_unit = Force::Unit.from_salesforce(unit).to_domain
        if domain_unit['leases']
          domain_unit['leases'] = domain_unit['leases']
                                    .filter { |lease| true if lease }
                                    .map { |lease| Force::Lease.from_salesforce(lease).to_domain }
        end
        domain_unit
      end
      domain_units
    end
  end
end
