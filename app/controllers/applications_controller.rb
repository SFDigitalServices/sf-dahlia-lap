# frozen_string_literal: true

# Rails controller for Applications related views/actions
class ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :application_listing, only: %i[listing_index new]

  def index
    @listings = soql_listing_service.pre_lottery_listings
  end

  def show
    # TODO: Move these fields into the frontend code
    # once react-routing is set up.
    @application_id = params[:id]
    @is_lease_up = params[:lease_up] == 'true'
    @show_add_btn = params[:showAddBtn]
  end

  def edit
    @application = soql_application_service.application(params[:id])
    @listing = soql_listing_service.listing(@application[:listing_id])
    @lending_institutions = soql_listing_service.sale?(@listing) ? lending_institutions : {}
    redirect_to application_url(id: @application.id) if
      @listing.lottery_status != 'Not Yet Run' ||
      @application&.application_submission_type != 'Paper'
  end

  private

  def application_listing
    @listing = soql_listing_service.listing(params[:listing_id])
  end

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end

  def soql_listing_service
    Force::Soql::ListingService.new(current_user)
  end

  def lending_institutions
    Force::CustomApi::LendingInstitutionsService.new(current_user).lending_institutions
  end
end
