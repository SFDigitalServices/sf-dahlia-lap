# frozen_string_literal: true

# Controller for listings objects
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.listings.map { |listing| Force::Listing.from_salesforce(listing).to_domain }
    @fields = service.index_fields
  end

  def show
    @listing = service.listing(params[:id])
  end

  private

  def service
    Force::ListingService.new(current_user)
  end
end
