# frozen_string_literal: true

module Force
  # Encapsulate all Salesforce Short Form Application querying functions
  class UnitsService < Force::Base
    DRAFT = 'Draft'
    FIELD_NAME = :units
    FIELDS = load_fields(FIELD_NAME).freeze

    # Returns the available units (units not assigned to any application) for
    # the specified listing, including the unit for the specified application.
    def available_units_for_application(listing_id, application_id)
      sub_query = builder.from(:Lease__c)
                         .select(:Unit__c)
                         .where_eq('Application__r.Listing__c', listing_id, :string)
                         .where("Application__c != '#{application_id}'")
                         .to_soql

      result = builder.from(:Unit__c)
             .select('Id, Unit_Number__c, Priority_Type__c')
             .where_eq('Listing__c', listing_id, :string)
             .where("Id NOT IN (#{sub_query})")
             .transform_results { |results| massage(results) }
             .query
             .records

      Force::Unit.convert_list(result, :from_salesforce, :to_domain)
    end
  end
end
