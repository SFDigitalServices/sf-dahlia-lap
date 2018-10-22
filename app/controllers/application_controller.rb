# frozen_string_literal: true

# Root controller from which all our Rails controllers inherit.
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

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
    listings_url
  end

  private

  def file_base_url
    current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  end
end
