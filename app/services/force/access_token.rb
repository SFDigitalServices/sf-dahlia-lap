require 'net/http'
require 'uri'

module Force
  # Utility for requesting access tokens for login into Salesforce
  module AccessToken
    def self.request_new_token
      client = restforce_client
      client.authenticate!
      client.options[:oauth_token]
    end

    def self.request_new_with_restforce_attributes
      {
        instance_url: EnvUtils.get!('SALESFORCE_INSTANCE_URL'),
        username: EnvUtils.get!('SALESFORCE_USERNAME'),
        password: EnvUtils.get!('SALESFORCE_PASSWORD'),
        security_token: EnvUtils.get!('SALESFORCE_SECURITY_TOKEN'),
        client_id: EnvUtils.get!('SALESFORCE_CLIENT_ID'),
        client_secret: EnvUtils.get!('SALESFORCE_CLIENT_SECRET'),
        api_version: EnvUtils.get!('SALESFORCE_API_VERSION'),
        mashify: false,
        authentication_retries: 1,
        host: 'test.salesforce.com',
      }
    end

    def self.restforce_client
      Restforce.new(request_new_with_restforce_attributes)
    end
  end
end
