# Rails controller for Listings related views/actions
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.listings
    @fields = service.index_fields
    @page_header = {title: 'Listings'}
  end

  def show
    @listing = service.listing(params[:id])
    @page_header = {title: @listing.Name}
  end

  private

  def service
    Force::ListingService.new(current_user)
  end
end
