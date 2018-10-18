# frozen_string_literal: true

module Listings
  # Rails controller for views/actions related to applications for a listing
  class ApplicationsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_listing
    before_action :validate_listing!

    def index
      @applications = application_service.listing_applications(params[:listing_id])
      @fields = application_service.index_fields
    end

    def new; end

    private

    def validate_listing!
      raise Force::RecordNotFound, "Listing #{params[:listing_id]} not found" unless @listing.present?
    end

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
