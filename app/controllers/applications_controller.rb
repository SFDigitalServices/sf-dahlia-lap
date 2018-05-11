# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @applications = application_service.applications
    @fields = application_service.index_fields
    @page_header = {title: 'Applications'}
  end

  def show
    @application = application_service.application(params[:id])
    @file_base_url = ENV['SALESFORCE_SERVLET']
  end

  def edit
    @application = application_service.application(params[:id])
    @listing = listing_service.listing(@application.Listing.Id)
    @page_header = {
      title: 'Edit Application',
      content: "Application lottery number: #{@application.Lottery_Number}. For listing: #{@listing.Name}"
    }
  end

  def listing_index
    @applications = application_service.listing_applications(params[:listing_id])
    @fields = application_service.index_fields
    @page_header = {title: @listing.Name}
  end

  # PROTOTYPE for editable "spreadsheet" table
  def spreadsheet
    # TODO: repurpose this whole method to pull in applications matching a certain flagged set
    # @applications = service.flagged_apps
    # just call same index method for now, but with a diff view
    index
    @page_header = {title: 'Applications Spreadsheet'}
  end

  def new
    # grabs @listing and renders form
    @page_header = {title: "New Application: #{@listing.Name}"}
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
