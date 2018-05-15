module Listings
  class LeaseUpsController < ApplicationController
    before_action :authenticate_user!

    def index
      full_listing = listing_service.listing(params[:listing_id])

      raise "Listing #{params[:listing_id]} not found" unless full_listing.present?

      @listing = compacted_listing(full_listing)
      @lease_ups = lease_up_service.lease_ups(params[:listing_id])
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end

    def listing_service
      Force::ListingService.new(current_user)
    end

    def compacted_listing(full_listing)
      full_listing.slice('Id', 'Name', 'Building_Street_Address')
    end
  end
end
