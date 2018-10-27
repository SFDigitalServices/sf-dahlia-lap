# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for rental assistances
    class RentalAssistanceService < Force::Base
      def create(domain_attrs)
        rental_assistance = Force::RentalAssistance.from_domain(domain_attrs)
        @client.create('Rental_Assistance__c', rental_assistance.to_salesforce)
      end

      def update(domain_attrs)
        rental_assistance = Force::RentalAssistance.from_domain(domain_attrs)
        @client.update('Rental_Assistance__c', rental_assistance.to_salesforce)
      end

      def destroy(id)
        @client.destroy('Rental_Assistance__c', id)
      end
    end
  end
end
