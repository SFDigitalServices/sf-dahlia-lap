# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should render successfully' do
      VCR.use_cassette('api/v1/applications_controller/index') do
        get :index, params: { listing_id: valid_listing_id }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['records'].size).to eq(28)
    end
  end

  describe '#update' do
    it 'should render true if update is successful' do
      VCR.use_cassette('api/v1/applications_controller/update/success') do
        params = {
          id: non_lease_up_application_id,
          application: { id: non_lease_up_application_id, total_monthly_rent: '600'}
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'should return with an error code if update is not successful' do
      VCR.use_cassette('api/v1/applications_controller/update/failure') do
        params = {
          id: 'invalid_id',
          application: { id: 'invalid_id', total_monthly_rent: '600'}
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:service_unavailable)
      json = JSON.parse(response.body)
      expect(json['message']).to include('NOT_FOUND')
    end
  end
end
