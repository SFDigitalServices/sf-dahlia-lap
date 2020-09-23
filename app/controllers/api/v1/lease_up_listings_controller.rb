# frozen_string_literal: true

module Api::V1
  # Lease Up Listings controller for access via the API
  class LeaseUpListingsController < ApiController
    def index
      listings = soql_listing_service.lease_up_listings
      render json: { listings: listings }
    end

    private

    def soql_listing_service
      Force::Soql::ListingService.new(current_user)
    end
  end
end
