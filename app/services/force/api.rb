# frozen_string_literal: true

module Force
  # Requests to Salesforce API
  class Api
    def initialize(client)
      @client = client
    end

    def api_call(method, endpoint, params)
      apex_endpoint = "/services/apexrest#{endpoint}"
      response = @client.send(method, apex_endpoint, params.as_json)
      response.body
    end

    def post(endpoint, params)
      api_call('post', endpoint, params)
    end

    def get(endpoint, params)
      api_call('get', endpoint, params)
    end

    def put(endpoint, params)
      api_call('put', endpoint, params)
    end
  end
end
