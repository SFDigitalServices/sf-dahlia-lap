# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @listings = listing_service.listings
  end

  def show
    # @application =  if is_lease
    #                   custom_api_application_service.snapshot(params[:id]) # SOQ: FIELDs
    #                 else
    #                   application_service.application(params[:id]) # CUSTOM API FIELDs
    #                 end

    # @application = application_service.application(params[:id])
    @application = find_application2(params[:id])
    @fields = application_service.show_fields
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

  def application_service
    Force::ApplicationService.new(current_user)
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

  def find_application2(id)
    is_lease = application_listing['Status'] == 'Lease Up'
    if is_lease
      application = custom_api_service.snapshot(id)
      application.roof_files = attachment_service.app_proof_files(id) if includes.include?('proof_files')
      application.flagged_applications = flagged_record_set_service.flagged_record_set(id) if includes.include?('flagged_applications')
      application
    else
      soql_application_service.application(id)
    end
  end
end
