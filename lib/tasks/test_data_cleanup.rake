# frozen_string_literal: true
namespace :tests do
  desc 'Cleanup E2E Test Data'
  task e2e_cleanup: :environment do
    puts 'Attempting to hit api to clean up front end test data.'
    # Create salesforce access token
    access_token = Force::AccessToken.request_new_with_restforce_attributes
    # Create restforce client
    client = Restforce.new(access_token)
    # Hit endpoint
    response = client.get('/services/apexrest/FrontEndTestDataCleanUp')
    if response.body == 200
      puts 'Successfully triggered front end test data cleanup.'
    else
      puts 'Error when triggering front end test data cleanup.'
    end
  end
end
