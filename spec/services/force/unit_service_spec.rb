# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::UnitsService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::UnitsService.new(user) }

  describe '#units_and_leases_for_listing' do
    expected_lease_keys = %i[
      application_id
      lease_status
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
      leases
    ]

    it 'should return lease fields when there is a lease on the unit' do
      VCR.use_cassette('services/force/unit_service/with_lease') do
        units = subject.units_and_leases_for_listing(YELLOW_ACRES_LISTING_ID)

        (expected_unit_keys).each do |key|
          expect(units.first).to have_key(key)
        end
        (expected_lease_keys).each do |key|
          expect(units.first.leases.first).to have_key(key)
        end
      end
    end

    it 'should not include lease fields if not present' do
      VCR.use_cassette('services/force/unit_service/without_lease') do
        units = subject.units_and_leases_for_listing(NOT_YET_RUN_LISTING_ID)

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
