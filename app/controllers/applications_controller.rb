# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
  end

  def show
    @application = application_service.application(params[:id])
    @fields = application_service.show_fields
    @file_base_url = current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  end

  def edit
    @application = application_service.application(params[:id])
    @listing = listing_service.listing(@application.Listing.Id)
  end

  private

  def application_listing
    @listing = listing_service.listing(params[:listing_id])
  end

  def application_service
    Force::ApplicationService.new(current_user)
  end

  def listing_service
    Force::ListingService.new(current_user)
  end
end
