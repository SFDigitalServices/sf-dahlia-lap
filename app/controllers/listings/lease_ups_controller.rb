module Listings
  class LeaseUpsController < ApplicationController
    before_action :authenticate_user!
    
    def index
      @listings = lease_up_service.lease_ups_listings
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end
  end
end
