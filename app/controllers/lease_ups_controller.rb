class LeaseUpsController < ApplicationController
  before_action :authenticate_user!

  def index
    if params[:listing_id]
      full_listing = listing_service.listing(params[:listing_id])

      raise "Listing #{params[:listing_id]} not found" unless full_listing.present?

      @listing = compacted_listing(full_listing)
      @lease_ups = lease_up_service.lease_ups(params[:listing_id])

      @page_header = {
        title: @listing.Name,
        content: @listing.Building_Street_Address,
        action: {title: 'Export', link: "/listings/#{@listing.Id}/lease_ups/export"},
        breadcrumbs: [
          {title: 'Lease Ups', link: '/lease_ups'},
          {title: @listing.Name, link: "/listings/#{@listing.Id}/lease_ups"}
        ]
      }
    else
      @page_header = {title: 'Lease Ups'}
    end
  end

  def lease_up_service
    Force::LeaseUpService.new(current_user)
  end

  def listing_service
    Force::ListingService.new(current_user)
  end

  def compacted_listing(full_listing)
    full_listing.slice('Id', 'Name', 'Building_Street_Address')
  end
end
