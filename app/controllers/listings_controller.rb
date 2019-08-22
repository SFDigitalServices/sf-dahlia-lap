# frozen_string_literal: true
require_relative '../helpers/listing_helper.rb'

# Controller for listings objects
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.listings.map { |listing| ListingHelper.map_listing_fields(listing) }
    @fields = service.index_fields
  end

  def show
    @listing = ListingHelper.map_listing_fields(service.listing(params[:id]))
  end

  private

  def service
    Force::ListingService.new(current_user)
  end
end
