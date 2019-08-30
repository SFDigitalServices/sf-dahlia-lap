# frozen_string_literal: true
require_relative '../../../helpers/listing_helper.rb'

module Listings::LeaseUps
  # Rails controller for views/actions related to applications for a listing that has Lease Up status
  class ApplicationsController < ApplicationController
    before_action :authenticate_user!

    def index
      full_listing = listing_service.listing(params[:lease_up_id])

      raise Force::RecordNotFound, "Listing #{params[:lease_up_id]} not found" unless full_listing.present?
      @listing = Force::Listing.from_salesforce(compacted_listing(full_listing)).to_domain
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end

    def listing_service
      Force::ListingService.new(current_user)
    end

    def compacted_listing(full_listing)
      full_listing.slice('Id', 'Name', 'Building_Street_Address', 'Listing_Lottery_Preferences', 'Report_id')
    end
  end
end
