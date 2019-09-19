# frozen_string_literal: true

module Listings
  # Rails controller for views/actions related to listings that have Lease Up status
  class LeaseUpsController < ApplicationController
    before_action :authenticate_user!

    def index
      @listings = soql_listing_service.lease_up_listings.map { |listing| Force::Listing.from_salesforce(listing).to_domain }
    end

    private

    def soql_listing_service
      Force::Soql::ListingService.new(current_user)
    end
  end
end
