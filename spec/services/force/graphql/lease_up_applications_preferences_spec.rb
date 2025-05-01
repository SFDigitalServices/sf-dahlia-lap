require 'rails_helper'

RSpec.describe Force::Graphql::LeaseUpApplicationPreferences do
  let(:user) { User.create(email: 'agent@example.com', admin: false) }
  let(:lease_up_listing_id) { 'a0W0P00000GbyuQUAR' }

  it 'queries data with search terms' do
    VCR.use_cassette('/services/force/graphql/lease-up-application-preferences-search') do
      params = {
        listing_id: lease_up_listing_id,
        search: 'becky,keller',
        page: 0,
      }
      lease_up_applications = Force::Graphql::LeaseUpApplicationPreferences.new(user, params)
      lease_up_applications.query
      applications = lease_up_applications.response_as_restforce_objects[:records]
      expect(applications.first.dig('Application', 'Applicant', 'First_Name')).to eq('Becky')
      expect(applications.first.dig('Application', 'Applicant', 'Last_Name')).to eq('Keller')
    end
  end

  it 'queries data with filters' do
    VCR.use_cassette('/services/force/graphql/lease-up-application-preferences-filters') do
      params = {
        listing_id: lease_up_listing_id,
        accessibility: ['Vision impairments, Hearing impairments', 'Mobility impairments'],
        total_household_size: ['2', '5+'],
        status: ['No Status', 'Processing', 'Lease Signed'],
        preference: ['Certificate of Preference (COP)', 'Live or Work in San Francisco Preference'],
        page: 0,
      }
      lease_up_applications = Force::Graphql::LeaseUpApplicationPreferences.new(user, params)
      lease_up_applications.query
      applications = lease_up_applications.response_as_restforce_objects[:records]
      expect(applications).to be_truthy
    end
  end
end
