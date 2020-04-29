# frozen_string_literal: true

# Controller for listings objects
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.pre_lottery_listings.map { |listing| Force::Listing.from_salesforce(listing).to_domain }
    @fields = service.index_fields
  end

  def show
    @listing = Force::Listing.from_salesforce(service.listing(params[:id])).to_domain
  end

  private

  def service
    Force::Soql::ListingService.new(current_user)
  end
end
