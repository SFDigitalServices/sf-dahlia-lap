# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::ListingService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::ListingService.new(user) }
  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing
  NON_LEASE_UP_LISTING_ID = 'a0W0P00000F8YG4UAN' # Automated test listing
  APPLICANT_LIST_LISTING_ID = 'a0W0t000001788TEAQ' # Sample listing with use applicant list for lease up

  describe '#lease_up_listings' do
    it 'should return the correct fields' do
      VCR.use_cassette('services/soql/listing_service') do
        listings = subject.lease_up_listings

        expected_keys = %i[id name lottery_date lottery_results_date in_lottery units_available lease_signed_application last_modified_date]
        expected_keys.each do |key|
          expect(listings.first).to have_key(key)
        end
      end
    end

    it 'should only return lease up listings not using applicant list' do
      VCR.use_cassette('services/soql/listing_service') do
        listings = subject.lease_up_listings
        ids = listings.map { |listing| listing[:id] }

        expect(ids).to include(LEASE_UP_LISTING_ID)
        expect(ids).not_to include(NON_LEASE_UP_LISTING_ID)
        expect(ids).not_to include(APPLICANT_LIST_LISTING_ID)
      end
    end
  end
end
