# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::LotteryResultsService do

  let(:user) { User.create(email: 'admin@example.com', admin: true) }
  subject { Force::Soql::LotteryResultsService.new(user) }

  describe 'app_preferences_for_listing' do
    it 'should create the correct query string' do
      VCR.use_cassette('services/soql/lottery_results_service') do
        response = subject.app_preferences_for_listing(YELLOW_ACRES_LISTING_ID)

        expect(response.total_size).to equal(43)
      end
    end
  end
end
