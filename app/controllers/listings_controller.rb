# Rails controller for Listings related views/actions
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.listings
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
