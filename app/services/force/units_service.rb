# frozen_string_literal: true

module Force
  # Encapsulate all Salesforce Short Form Application querying functions
  class UnitsService < Force::Base
    DRAFT = 'Draft'
    FIELD_NAME = :units
    FIELDS = load_fields(FIELD_NAME).freeze

    # Returns units and relevant lease information for specified listing.
    # Units contain info about unit number + eligibility. We merge
    # this with Lease info about which application is assigned to a unit and
    # what preference was used.
    def units_and_leases_for_listing(listing_id)
      lease_query = builder.from(:Leases__r)
                         .select('Application__c, Preference_Used_Name__c')
                         .to_soql

      result = builder.from(:Unit__c)
             .select("Id, Priority_Type__c, AMI_chart_type__c, Max_AMI_for_Qualifying_Unit__c, Unit_Number__c, Unit_Type__c, AMI_chart_year__c, (#{lease_query})")
             .where_eq('Listing__c', listing_id, :string)
             .transform_results { |results| massage(results) }
             .query
             .records

      domain_units = result.map do |unit|
        # Flatten lease fields and merge with unit fields
        lease = unit['Leases'] ? unit['Leases'][0] : nil
        domain_lease_fields = Force::Lease.from_salesforce(lease).to_domain if lease
        domain_unit = Force::Unit.from_salesforce(unit).to_domain
        domain_unit.merge(domain_lease_fields || {})
      end
      domain_units
    end
  end
end
