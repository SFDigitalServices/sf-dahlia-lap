# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for leases
    class LeaseService < Force::Base
      def lease(application_id)
        builder
          .from(:Lease__c)
          .select(
            :Id,
            :Unit__c,
            :Lease_Start_Date__c,
            :Lease_Status__c,
            :Monthly_Parking_Rent__c,
            :Preference_Used__c,
            :No_Preference_Used__c,
            :Total_Monthly_Rent_without_Parking__c,
            :Monthly_Tenant_Contribution__c,
          )
          .where_eq(:Application__c, application_id, :string)
          .transform_results { |results| massage(results) }
          .query
          .records
          .first
      end
    end
  end
end
