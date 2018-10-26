# frozen_string_literal: true
module Force
  module Rest
    # Provide Salesforce standard REST API interactions for preferences
    class RentalAssistanceService < Force::Base
      def create(rental_assistance)
        @client.create('Rental_Assistance__c', rental_assistance.to_salesforce)
      end

      def update(rental_assistance)
        @client.update('Rental_Assistance__c', rental_assistance.to_salesforce)
      end
    end
  end
end
