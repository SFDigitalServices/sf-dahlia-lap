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

  def soql_preference_service
    Force::Soql::PreferenceService.new(current_user)
  end

  def soql_attachment_service
    Force::Soql::AttachmentService.new(current_user)
  end

  def flagged_record_set_service
    Force::FlaggedRecordSetService.new(current_user)
  end

  def find_application(id)
    listing = soql_application_service.application_listing(id)

    # Get the application via the custom API. Use the snapshot of
    # the application if the listing is in Lease Up.
    is_listing_lease_up = listing.Status == 'Lease Up'
    application = custom_api_application_service.application(id, snapshot: is_listing_lease_up)

    # Add a couple of listing details
    application.listing = {
      id: listing.Id,
      name: listing.Name,
    }

    # Add additional data
    application.proof_files = soql_attachment_service.app_proof_files(id)
    # application['flagged_applications'] = flagged_record_set_service.flagged_record_set(id)

    application # domain application with all additional info, e.g. preferences, etc., added onto it
  end
end
