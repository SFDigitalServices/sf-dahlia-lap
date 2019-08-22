# frozen_string_literal: true
require_relative '../../helpers/listing_helper.rb'

module Listings
  # Rails controller for views/actions related to applications for a listing
  class ApplicationsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_listing
    before_action :validate_listing!
    before_action :listing_accepts_new_applications, only: [:new]

    def index
      @applications = soql_application_service.listing_applications(params[:listing_id])
      @fields = soql_application_service.index_fields
    end

    def new
      @lending_institutions = listing_service.sale?(@listing) ? lending_institutions : {}
    end

    private

    def validate_listing!
      raise Force::RecordNotFound, "Listing #{params[:listing_id]} not found" unless @listing.present?
    end

    def load_listing
      @listing = ListingHelper.map_listing_fields(listing_service.listing(params[:listing_id]))
    end

    def listing_service
      Force::ListingService.new(current_user)
    end

    def soql_application_service
      Force::Soql::ApplicationService.new(current_user)
    end

    def lending_institutions
      Force::CustomApi::LendingInstitutionsService.new(current_user).lending_institutions
    end

    def listing_accepts_new_applications
      redirect_to listing_url(id: @listing.id) if @listing&.lottery_status != 'Not Yet Run'
    end
  end
end
