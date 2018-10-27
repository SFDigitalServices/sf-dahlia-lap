# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for rental assistances
    class RentalAssistanceService < Force::Base
      def application_rental_assistances(application_id)
        builder
          .from(:Rental_Assistance__c)
          .select(
            :Assistance_Amount__c,
            :Id,
            :Lease__c,
            :Other_Assistance_Name__c,
            :Household_Member__c,
            :Recurring_Assistance__c,
            :Type_of_Assistance__c,
          )
          .where_eq('Lease__r.Application__c', application_id, :string)
          .transform_results { |results| massage(results) }
          .query
          .records
      end
    end
  end
end
