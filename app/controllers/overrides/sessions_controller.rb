module Overrides
  # Overrides to DeviseTokenAuth
  class SessionsController < Devise::SessionsController
    def destroy
      @logout_path = current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
      Force::Base.new(current_user).revoke_token
      super
    end

    def after_sign_out_path_for(resource_or_scope)
      "#{@logout_path}/secur/logout.jsp"
    end
  end
end
