# Root controller from which all our Rails controllers inherit.
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from Restforce::UnauthorizedError,
              Restforce::AuthenticationError do
    sign_out current_user
    redirect_to root_path, flash: { alert: 'You have been signed out.' }
  end

  def after_sign_in_path_for(user)
    listings_url
  end
end
