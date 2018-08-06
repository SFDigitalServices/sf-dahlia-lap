module Listings
  class ApplicationsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_listing

    def index
      @applications = application_service.listing_applications(params[:listing_id])
      @fields = application_service.index_fields
    end

    def new
    end

    private

    def load_listing
      @listing = listing_service.listing(params[:listing_id])
    end

    def listing_service
      Force::ListingService.new(current_user)
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end
  end
end
