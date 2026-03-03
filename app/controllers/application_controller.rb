# frozen_string_literal: true

# Root controller from which all our Rails controllers inherit.
class ApplicationController < ActionController::Base
  before_action :load_listing_on_lease_up_page
  protect_from_forgery with: :exception

  rescue_from Restforce::UnauthorizedError,
              Restforce::AuthenticationError do
    sign_out current_user
    redirect_to root_path, flash: { alert: 'You have been signed out.' }
  end

  rescue_from Force::RecordNotFound, with: :not_found

  INCLUSIONARY_RENTAL = 'IH-RENTAL'

  def not_found
    render '404', status: 404
  end

  def after_sign_in_path_for(_user)
    lease_ups_url
  end

  private

  def file_base_url
    current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  end

  def load_listing_on_lease_up_page
    @listing = nil
    @show_invite_to_apply_feedback_banner = false
    lease_up_page = request.path.match?('/lease-ups/listings/')

    return unless lease_up_page

    @listing = soql_listing_service.listing(params[:lease_up_id])
    @show_invite_to_apply_feedback_banner = @listing.program_type == INCLUSIONARY_RENTAL && ENV['BANNER_INVITE_TO_APPLY_FEEDBACK'] == 'true'
  end

  def soql_listing_service
    Force::Soql::ListingService.new(current_user)
  end
end
