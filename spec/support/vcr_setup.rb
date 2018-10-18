require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'spec/vcr'
  config.hook_into :webmock

  # Look for instances of these protected values showing up in our VCR requests
  # and filter them out with e.g. "<<SALESFORCE_USERNAME>>".
  %w[
    SALESFORCE_HOST
    SALESFORCE_INSTANCE_URL
    SALESFORCE_API_VERSION
    SALESFORCE_USERNAME
    SALESFORCE_PASSWORD
    SALESFORCE_SECURITY_TOKEN
    SALESFORCE_CLIENT_SECRET
    SALESFORCE_CLIENT_ID
    EASYPOST_API_KEY
  ].each do |val|
    config.filter_sensitive_data("<<#{val}>>") do
      ENV[val]
    end
  end

  # Also look for and replace any URL encoded versions of the username and
  # password and filter those out too.
  %w[
    SALESFORCE_USERNAME
    SALESFORCE_PASSWORD
  ].each do |val|
    config.filter_sensitive_data("<<#{val}>>") do
      CGI.escape(ENV[val])
    end
  end

  config.filter_sensitive_data('<<ACCESS_TOKEN>>') do |interaction|
    begin
      j = JSON.parse(interaction.response.body)
      j.try(:[], 'access_token')
    rescue JSON::ParserError, TypeError
      nil
    end
  end

  config.filter_sensitive_data('<<ACCESS_TOKEN>>') do |interaction|
    h = interaction.request.headers
    if h['Authorization'] && h['Authorization'].first
      h['Authorization'].first.split('OAuth ').last
    end
  end

  # This can be used to manipulate the response before saving
  # config.before_record do |interaction|
  # end
end
