# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LeaseUpListingsController, type: :controller do
  render_views
  login_admin

  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing

  describe '#index' do
    it 'returns all lease up listings' do
      VCR.use_cassette('/api/v1/lease-ups/listings') do
        get :index
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['listings']).not_to be_empty
      expect(json['listings'].length > 1).to eq(true)
      all_listings_have_names = json['listings'].all? { |l| l['name'] }
      expect(all_listings_have_names).to eq(true)
    end
  end

  describe '#show' do
    it 'returns the lease up listing' do
      VCR.use_cassette('/api/v1/lease-ups/listing') do
        get :show, params: { id: LEASE_UP_LISTING_ID }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json['listing']).not_to be_empty
      expect(json['listing']['name']).to eq('Partners Test Listing (do not modify) - Yellow Acres')
    end
  end
end
