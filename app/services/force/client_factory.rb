# frozen_string_literal: true

module Force
  # Creates clients for querying Salesforce
  class ClientFactory
    def initialize(user)
      @user = user
    end

    def build
      if Rails.env.test?
        new_with_oauth_token(AccessToken.request_new_token)
      else
        new_with_oauth_token(@user.oauth_token)
      end
    end

    def new_with_oauth_token(oauth_token)
      Restforce.new(
        authentication_retries: 1,
        oauth_token: oauth_token,
        instance_url: ENV['SALESFORCE_INSTANCE_URL'],
      )
    end
  end
end
