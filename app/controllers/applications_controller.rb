# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @listings = listing_service.listings
  end

  def show
    @application = find_application(params[:id])
    @fields = soql_application_service.show_fields
    @file_base_url = file_base_url
  end

  def edit
    @application = application_service.application(params[:id])
    @listing = listing_service.listing(@application.Listing.Id)
  end

  private

  def application_listing
    @listing = listing_service.listing(params[:listing_id])
  end

  def custom_api_application_service
    Force::CustomApi::ApplicationService.new(current_user)
  end

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end

  def listing_service
    Force::ListingService.new(current_user)
  end

  def flagged_record_set_service
    Force::FlaggedRecordSetService.new(current_user)
  end

  def attachment_service
    Force::Soql::AttachmentService.new(current_user)
  end

  def find_application(id)
    # TODO: May need to place the application show route underneath
    # a listing, since now the way we display an application depends
    # on the status of the application's listing
    listing_in_lease_up = application_listing['Status'] == 'Lease Up'
    if listing_in_lease_up
      application = custom_api_application_service.snapshot(id)
      application.proof_files = attachment_service.app_proof_files(id)
      application.flagged_applications = flagged_record_set_service.flagged_record_set(id)
      application
    else
      soql_application_service.application(id)
    end
  end
end
