# frozen_string_literal: true

require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'spec/vcr'
  config.hook_into :webmock

  # The below code can be used to re-record a specific casette. Replace the cassette name with the one you want to re-record.
  # config.default_cassette_options = {
  #   record: :once
  # }
  # config.before_record do |interaction|
  #   if interaction.cassette.name == 'api/v1/short-form/show/non_lease_up_application'
  #     interaction.cassette.record_mode = :all
  #   end
  # end

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
    DAHLIA_API_URL
    DAHLIA_API_KEY
    TEST_EMAIL
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
    h['Authorization'].first.split('OAuth ').last if h['Authorization']&.first
  end

  # This can be used to manipulate the response before saving
  # config.before_record do |interaction|
  # end
end
