# frozen_string_literal: true

# Rails controller for Omniauth Callbacks
class CallbacksController < Devise::OmniauthCallbacksController
  def salesforce
    salesforce_callback
  end

  def salesforcesandbox
    salesforce_callback
  end

  private

  def salesforce_callback
    @user = User.from_omniauth(request.env['omniauth.auth'])
    sign_in_and_redirect @user
  end
end
