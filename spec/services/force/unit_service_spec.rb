# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::UnitsService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::UnitsService.new(user) }
  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing
  NON_LEASE_UP_LISTING_ID = 'a0W0P00000F8YG4UAN' # Automated test listing
  APPLICANT_LIST_LISTING_ID = 'a0W0t000001788TEAQ' # Sample listing with use applicant list for lease up

  describe '#units_and_leases_for_listing' do
    expected_lease_keys = %i[
      application_id
      preference_used_name
    ]

    expected_unit_keys = %i[
      id
      priority_type
      ami_chart_type
      max_ami_for_qualifying_unit
      unit_number
      unit_type
      ami_chart_year
    ]

    it 'should return lease fields when there is a lease on the unit' do
      VCR.use_cassette('services/force/unit_service/with_lease') do
        units = subject.units_and_leases_for_listing(LEASE_UP_LISTING_ID)

        (expected_lease_keys + expected_unit_keys).each do |key|
          expect(units.first).to have_key(key)
        end
      end
    end

    it 'should not include lease fields if not present' do
      VCR.use_cassette('services/force/unit_service/without_lease') do
        units = subject.units_and_leases_for_listing(NON_LEASE_UP_LISTING_ID)

        expected_lease_keys.each do |key|
          expect(units.first).not_to have_key(key)
        end

        expected_unit_keys.each do |key|
          expect(units.first).to have_key(key)
        end
      end
    end
  end
end
