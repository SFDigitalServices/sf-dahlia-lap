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

    def self.restforce_client
      Restforce.new(request_new_with_restforce_attributes)
    end

    def self.request_new_with_restforce
      client = restforce_client
      client.authenticate!
      client.options[:oauth_token]
    end

    def self.request_new_with_restforce_attributes
      {
        instance_url: ENV['SALESFORCE_INSTANCE_URL'],
        username: ENV['SALESFORCE_USERNAME'],
        password: ENV['SALESFORCE_PASSWORD'],
        security_token: ENV['SALESFORCE_SECURITY_TOKEN'],
        client_id: ENV['SALESFORCE_CLIENT_ID'],
        client_secret: ENV['SALESFORCE_CLIENT_SECRET'],
        api_version: ENV['SALESFORCE_API_VERSION'],
        mashify: false,
        authentication_retries: 1,
        host: 'test.salesforce.com',
      }
    end

    def self.request_new_with_credentials
      request_new(request_new_with_credentials_attributes)
    end

    def self.request_new_with_credentials_attributes
      {
        url: "#{ENV['SALESFORCE_INSTANCE_URL']}/services/oauth2/token",
        username: ENV['SALESFORCE_USERNAME'],
        password: ENV['SALESFORCE_PASSWORD'],
        client_id: ENV['SALESFORCE_CLIENT_ID'],
        client_secret: ENV['SALESFORCE_CLIENT_SECRET'],
      }
    end

    def self.request_new(opts)
      form_data = {
        'client_id' => opts.fetch(:client_id),
        'client_secret' => opts.fetch(:client_secret),
        'grant_type' => 'password',
        'password' => opts.fetch(:password),
        'username' => opts.fetch(:username),
      }
      ap form_data
      url = opts.fetch(:url)
      post_response = _post(url, form_data)
      response = Response.new(post_response.body)

      raise CannotGetTokenException, response.body if response.invalid?

      response.token
    end

    def self._post(url, form_data)
      uri = URI.parse(url)
      request = Net::HTTP::Post.new(uri)
      request.set_form_data(form_data)
      req_options = {
        use_ssl: uri.scheme == 'https',
      }
      Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
    end
  end
end
