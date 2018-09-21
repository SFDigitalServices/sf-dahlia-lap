require 'net/http'
require 'uri'

module Force
  # Utility for requesting access tokens for login into saleforce
  module AccessToken
    # Token response
    class Response
      attr_reader :body
      def initialize(body)
        @body = JSON.parse(body)
      end

      def invalid?
        @body.key?('error')
      end

      def token
        @body['access_token']
      end
    end

    class CannotGetTokenException < StandardError; end

    # This should be use to get a new token, regardles of the underline method.
    def self.request_new_token
      request_new_with_restforce
    end

    ##########################################
    # Request new token unsing Restforce lib
    ##########################################

    def self.request_new_with_restforce
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

    ####################################################
    # Request new token unsing HTTP post with oauth2
    ####################################################

    def self.request_new_with_http
      http_post(request_new_with_http_attributes)
    end

    def self.request_new_with_http_attributes
      {
        url: "#{EnvUtils.get!('SALESFORCE_INSTANCE_URL')}/services/oauth2/token",
        username: EnvUtils.get!('SALESFORCE_USERNAME'),
        password: EnvUtils.get!('SALESFORCE_PASSWORD'),
        client_id: EnvUtils.get!('SALESFORCE_CLIENT_ID'),
        client_secret: EnvUtils.get!('SALESFORCE_CLIENT_SECRET'),
      }
    end

    # Makes the actual call to oauth to get the token
    def self.http_post(opts)
      form_data = {
        'client_id'     => opts.fetch(:client_id),
        'client_secret' => opts.fetch(:client_secret),
        'grant_type'    => 'password',
        'password'      => opts.fetch(:password),
        'username'      => opts.fetch(:username),
      }
      url = opts.fetch(:url)
      post_response = HttpUtils.post(url, form_data)
      response = Response.new(post_response.body)

      raise CannotGetTokenException, response.body if response.invalid?

      response.token
    end
  end
end
