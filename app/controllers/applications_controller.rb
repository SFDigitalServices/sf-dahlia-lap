# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @applications = application_service.applications
    @fields = application_service.index_fields
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

  # PROTOTYPE for editable "spreadsheet" table
  def spreadsheet
    # TODO: repurpose this whole method to pull in applications matching a certain flagged set
    # @applications = service.flagged_apps
    # just call same index method for now, but with a diff view
    index
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
