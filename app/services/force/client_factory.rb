module Force
  # Creates clients for quering saleforce
  class ClientFactory
    def new_for_user(user)
      if Rails.env.test?
        new_with_oauth_token(AccessToken.request_new_with_credentials)
      else
        new_with_oauth_token(user.oauth_token)
      end
    end

    def new_with_oauth_token(oauth_token)
      Restforce.new(
        authentication_retries: 1,
        oauth_token: oauth_token,
        instance_url: ENV['SALESFORCE_INSTANCE_URL'],
      )
    end

    def self.instance
      @instance ||= ClientFactory.new
    end
  end
end
