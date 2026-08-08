# frozen_string_literal: true


# Root controller from which all our Rails controllers inherit.
class ApplicationController < ActionController::Base
  before_action :load_listing_on_lease_up_page
  protect_from_forgery with: :exception

  # Fixture mode has no Salesforce connection, so Salesforce OAuth can't be
  # completed locally. Sign in a throwaway user instead. Double-guarded: the
  # constant is only defined in development, and the filter re-checks at
  # request time. See script/fixtures/README.md.
  if Rails.env.development? && ENV['SF_FIXTURES'].present?
    before_action :sign_in_fixture_user!
  end

  rescue_from Restforce::UnauthorizedError,
              Restforce::AuthenticationError do
    sign_out current_user
    redirect_to root_path, flash: { alert: 'You have been signed out.' }
  end

  rescue_from Force::RecordNotFound, with: :not_found

  def not_found
    render '404', status: 404
  end

  def after_sign_in_path_for(_user)
    lease_ups_url
  end

  private

  def sign_in_fixture_user!
    raise 'fixture user is development-only' unless Rails.env.development? && ENV['SF_FIXTURES'].present?
    return if user_signed_in?

    user = User.find_or_initialize_by(provider: 'fixtures', uid: 'fixtures')
    user.assign_attributes(
      email: 'fixtures@example.com',
      admin: true,
      oauth_token: 'fixture-mode-no-salesforce-connection',
      salesforce_user_id: 'fixture-user',
      salesforce_account_id: 'fixture-account',
    )
    user.save!
    sign_in(user)
  end

  def file_base_url
    current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  end

  def load_listing_on_lease_up_page
    @listing = nil
    @show_invite_to_apply_feedback_banner = false
    lease_up_page = request.path.match?('/lease-ups/listings/')

    return unless lease_up_page

    @listing = soql_listing_service.listing(params[:lease_up_id])
    @show_invite_to_apply_feedback_banner = (@listing.leaseup_outreach == 'Appointments required' || 
                                            @listing.leaseup_outreach == 'Submit all info online') &&
                                            ENV['BANNER_INVITE_TO_APPLY_FEEDBACK'] == 'true'
  end

  def soql_listing_service
    Force::Soql::ListingService.new(current_user)
  end
end
