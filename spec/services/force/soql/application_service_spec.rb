# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::ApplicationService do

  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::ApplicationService.new(user) }

  describe 'applications' do
    it 'query for applications' do
      VCR.use_cassette('services/soql/application_service') do
        applications = subject.applications({
            application_number: lease_up_application_id,
            listing_id: lease_up_listing_id,
            first_name: 'Automated Test Lease Up Application',
            last_name: '(do not modify)',
            submission_type: 'Paper',
        })

        expect(applications).to be_any
      end
    end
  end
end
