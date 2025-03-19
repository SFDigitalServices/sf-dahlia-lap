# frozen_string_literal: true

# Controller for listings objects
class ListingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @listings = service.pre_lottery_listings
    @fields = service.index_fields
  end

  def show
    @listing = service.listing(params[:id])
    @user_is_admin = current_user.admin.present?
  end

  private

  def service
    Force::Soql::ListingService.new(current_user)
  end
end
