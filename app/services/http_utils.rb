# Utility module for http requests and responses
module HttpUtils
  def self.post(url, form_data)
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
