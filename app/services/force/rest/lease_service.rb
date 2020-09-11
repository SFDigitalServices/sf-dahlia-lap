# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for applications
    class LeaseService < Force::Base
      def create(domain_attrs)
        lease = Force::Lease.from_domain(domain_attrs)
        @client.create!('Lease__c', lease.to_salesforce)
      end

      def update(domain_attrs)
        lease = Force::Lease.from_domain(domain_attrs)
        @client.update!('Lease__c', lease.to_salesforce)
      end

      def destroy(lease_id)
        rental_assistance_service = Force::CustomApi::RentalAssistanceService.new(@user)
        rental_assistance_service.delete_by('Lease__c', lease_id)
        @client.destroy('Lease__c', lease_id)
      end
    end
  end
end
