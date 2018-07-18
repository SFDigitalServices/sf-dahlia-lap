module Listings
  # Rails controller for views/actions related to listings that have Lease Up status
  class LeaseUpsController < ApplicationController
    before_action :authenticate_user!

    def index
      @listings = lease_up_service.lease_up_listings
    end

    private

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end
  end
end
