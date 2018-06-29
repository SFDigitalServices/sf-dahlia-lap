module Force
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
  end
end
