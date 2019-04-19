# frozen_string_literal: true

module Overrides
  # Overrides to DeviseTokenAuth
  class SessionsController < Devise::SessionsController

    def create
      session['admin'] = resource.admin
      p session
      super
    end

    def destroy
      @salesforce_logout_host = current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
      Force::Base.new(current_user).revoke_token
      super
    end

    def after_sign_out_path_for(resource_or_scope)
      if @salesforce_logout_host
        "#{@salesforce_logout_host}/secur/logout.jsp"
      else
        super(resource_or_scope)
      end
    end
  end
end
