# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ListingsController, type: :controller do
  render_views
  login_admin

  describe '#update' do
    it 'should render true if update is successful' do
      VCR.use_cassette('api/v1/listings_controller/update/success') do
        params = {
          id: lease_up_listing_id,
          listing: { id: lease_up_listing_id, file_upload_url: 'http://sf.gov' }
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'should return with an error code if update is not successful' do
      VCR.use_cassette('api/v1/listings_controller/update/failure') do
        params = {
          id: 'invalid_id',
          listing: { id: 'invalid_id', file_upload_url: 'http://sf.gov' }
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:service_unavailable)
      json = JSON.parse(response.body)
      expect(json['message']).to include('NOT_FOUND')
    end
  end
end
