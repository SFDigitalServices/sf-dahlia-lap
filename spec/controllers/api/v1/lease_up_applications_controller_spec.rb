# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LeaseUpApplicationsController, type: :controller do
  render_views
  login_admin

  lease_up_listing = 'a0W0P00000GbyuQUAR' # Lease up Listing
  lease_up_listing_with_pagination = 'a0W4U00000SWge5UAD' # Lease up Listing with more than 200 applications
  # if you need to re-record the first come first served spec, you might have to recreate the listing
  fcfs_listing =  'a0W4U00000SWKbMUAX' # First Come First Served listing in lease up

  describe '#index' do
    it 'returns only applications with preferences where preference_all_name and preference_all_lottery_rank exist' do
      VCR.use_cassette('/api/v1/lease-ups/applications') do
        params = {
          listing_id: lease_up_listing,
          page: 0,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      all_records_have_preferences = json['records'].all? do |r|
        (
              r['preference_name'] && r['preference_name'].length > 0 && r['preference_all_lottery_rank'] && r['preference_all_lottery_rank'] > 0
            )
      end
      expect(all_records_have_preferences).to eq(true)
    end
    it 'returns paginated data' do
      VCR.use_cassette('/api/v1/lease-ups/applications-paginated') do
        params = {
          listing_id: lease_up_listing_with_pagination,
          page: 1,
          record_batch_size: 200,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['total_size']).to be > 200
    end
    it 'returns paginated data for fcfs listings' do
      VCR.use_cassette('/api/v1/lease-ups/fcfs-applications-paginated') do
        params = {
          listing_id: fcfs_listing,
          page: 1,
          record_batch_size: 200,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['total_size']).to be > 200
    end
    it 'returns custom preference type' do
      VCR.use_cassette('/api/v1/lease-ups/applications') do
        params = {
          listing_id: lease_up_listing,
          page: 0,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      all_records_have_custom_preferences = json['records'].all? do |r|
        r['custom_preference_type'].present?
      end
      expect(all_records_have_custom_preferences).to eq(true)
    end
    it 'returns applications for a first come first serve listing' do
      VCR.use_cassette('/api/v1/lease-ups/fcfs-applications') do
        params = {
          listing_id: fcfs_listing,
          page: 0,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['listing_type']).to eq('First Come, First Served')
    end
  end
end
