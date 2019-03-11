# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for applications
    class LeaseService < Force::Base
      def create(domain_attrs)
        lease = Force::Lease.from_domain(domain_attrs)
        @client.create!('Lease__c', lease.to_salesforce)
      end

      def dummy_create(domain_attrs)
        lease = Force::Lease.from_domain(domain_attrs)
        @client.create!('Lease__c', lease.to_salesforce)
      end

      def update(domain_attrs)
        lease = Force::Lease.from_domain(domain_attrs)
        @client.update!('Lease__c', lease.to_salesforce)
      end
    end
  end
end
