module Force

  class ClientFactory

    def new_for_user(user)
      if Rails.env.test?
        new_with_username_and_password
      else
        new_with_oauth_token(user.oauth_token)
      end
    end

    def username_and_password_attributes
      {
        username: ENV['SALESFORCE_USERNAME'],
        password: ENV['SALESFORCE_PASSWORD'],
        security_token: ENV['SALESFORCE_SECURITY_TOKEN'],
        client_id: ENV['SALESFORCE_CLIENT_ID'],
        client_secret: ENV['SALESFORCE_CLIENT_SECRET'],
        api_version: '41.0',
      }
    end

    def new_with_username_and_password
      Restforce.new(username_and_password_attributes)
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
