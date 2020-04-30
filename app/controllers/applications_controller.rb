# frozen_string_literal: true

# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @listings = soql_listing_service.pre_lottery_listings.map { |listing| Force::Listing.from_salesforce(listing).to_domain }
  end

  def show
    @application = find_application(params[:id])
    @fields = soql_application_service.show_fields
    @file_base_url = file_base_url
    @is_lease_up = params[:lease_up] == 'true'
  end

  def edit
    @application = soql_application_service.application(params[:id])
    @listing = soql_listing_service.listing(@application.Listing.Id)
    @lending_institutions = soql_listing_service.sale?(@listing) ? lending_institutions : {}
    redirect_to application_url(id: @application.Id) if
      @listing.lottery_status != 'Not Yet Run' ||
      @application&.Application_Submission_Type != 'Paper'
  end

  private

  def application_listing
    @listing = soql_listing_service.listing(params[:listing_id]))
  end

  def custom_api_application_service
    Force::CustomApi::ApplicationService.new(current_user)
  end

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end

  def soql_listing_service
    Force::Soql::ListingService.new(current_user)
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
    listing = Force::Listing.from_salesforce(soql_application_service.application_listing(id)).to_domain

    # Get the application via the custom API. Use the snapshot of
    # the application if the listing is in Lease Up.
    is_listing_lease_up = listing[:status] == 'Lease Up'
    application = custom_api_application_service.application(id, snapshot: is_listing_lease_up)

    return unless application

    # Add a flag on the application indicating whether or not it is a snapshot
    application.is_snapshot = is_listing_lease_up

    # Add a couple of listing details
    # TODO: Evolve the data shape expected by React to move the
    # listing out from under the application, and then we can
    # also make the listing its own object here
    application.listing = {
      id: listing.id,
      name: listing.name,
      is_sale: (listing.tenure == 'New sale' || listing.tenure == 'Resale'),
      is_lottery_complete: listing.lottery_status != 'Not Yet Run',
    }

    map_lending_institution(application)

    # Add proof files
    application.proof_files = soql_attachment_service.app_proof_files(id)

    # Add flagged applications
    # TODO: Move the translation of the flagged record sets into a service.
    # Also, see if we can simplify the structure of flagged_applications in
    # the React app and here. The React app expects a certain shape, hence the
    # seemingly extraneous structure around the flagged applications here.
    record_sets = flagged_record_set_service.flagged_record_set(id).map(&:Flagged_Record_Set)
    flagged_applications = []
    record_sets.each do |fields|
      set = Force::FlaggedRecordSet.from_salesforce(fields).to_domain
      flagged_applications << { flagged_record: set }
    end
    application.flagged_applications = flagged_applications

    # Because we are getting the application info through the custom
    # API, we do not get a value for total household size. So, we
    # calculate it here. TODO: See if total household size can be
    # added to custom API short form response so that we don't
    # have to do this here.
    application.total_household_size = application.household_members.length + 1

    # Return a domain-formatted application with additional
    # domain-formatted info added onto it
    application
  end

  def lending_institutions
    Force::CustomApi::LendingInstitutionsService.new(current_user).lending_institutions
  end

  def map_lending_institution(application)
    return unless application.listing[:is_sale]

    agent = Force::CustomApi::LendingInstitutionsService.new(current_user).find_agent(application.lending_agent)
    if agent.present?
      application.lending_institution = agent[:lending_institution]
      application.name_of_lender = agent[:name_of_lender]
    else
      application.lending_institution = 'None'
      application.name_of_lender = 'None'
    end
  end
end
