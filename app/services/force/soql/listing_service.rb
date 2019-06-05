# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for listings
    class ListingService < Force::Base
      FIELD_NAME = :listings
      FIELDS = load_fields(FIELD_NAME).freeze

      def lease_up_listings
        massage(query(%(
          SELECT #{query_fields(:lease_up_listing)}
          FROM Listing__c
          WHERE Status__c = 'Lease Up'
        )))
      end
    end
  end
end
