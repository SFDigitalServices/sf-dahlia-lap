require 'rails_helper'

RSpec.describe Force::Graphql::LeaseUpApplications do
  let(:user) { User.create(email: 'agent@example.com', admin: false) }
  let(:fcfs_listing_id) { 'a0W4U00000SWKbMUAX' }

  it 'queries data with search terms' do
    VCR.use_cassette('/services/force/graphql/lease-up-applications-search') do
      params = {
        listing_id: fcfs_listing_id,
        search: 'carlos,mathews',
        page: 0,
      }
      lease_up_applications = Force::Graphql::LeaseUpApplications.new(user, params)
      lease_up_applications.query
      applications = lease_up_applications.response_as_restforce_objects[:records]
      expect(applications.first.dig('Applicant', 'First_Name')).to eq('Carlos')
      expect(applications.first.dig('Applicant', 'Last_Name')).to eq('Mathews')
    end
  end

  it 'queries data with filters' do
    VCR.use_cassette('/services/force/graphql/lease-up-applications-filters') do
      params = {
        listing_id: fcfs_listing_id,
        accessibility: ['Vision impairments, Hearing impairments', 'Mobility impairments'],
        total_household_size: ['1', '5+'],
        status: ['No Status', 'Disqualified', 'Approved'],
        page: 0,
      }
      lease_up_applications = Force::Graphql::LeaseUpApplications.new(user, params)
      lease_up_applications.query
      applications = lease_up_applications.response_as_restforce_objects[:records]
      expect(applications).to be_truthy
    end
  end
end
