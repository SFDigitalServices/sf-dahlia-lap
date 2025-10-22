# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for listings
    class ListingService < Force::Base
      def update(domain_attrs)
        listing = Force::Listing.from_domain(domain_attrs)
        @client.update!('Listing__c', listing.to_salesforce)
      end
    end
  end
end
