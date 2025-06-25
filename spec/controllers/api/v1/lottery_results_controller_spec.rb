# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LotteryResultsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'returns lottery results' do
      VCR.use_cassette('api/v1/lottery-results') do
        get :index, params: { listing_id: "a0W4U00000HEJ7TUAX" }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['records']).not_to be_empty
      expect(json['total_size'] > 1).to eq(true)
    end

    it 'returns lottery results by using the LotteryResult' do
      VCR.use_cassette('api/v1/lottery-results-with-LotteryResult-api') do
        get :index, params: { listing_id: 'a0W4U00000HEJ7TUAX', use_lottery_result_api: 'true' }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['lotteryBuckets']).not_to be_empty
    end
  end
end
