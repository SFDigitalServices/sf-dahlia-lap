# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LeasesController, type: :controller do
  login_admin

  application_with_lease = 'a0o0P00000GZazOQAT' # Automated Test application
  test_lease_id = 'a130P000005TeZrQAK' # Lease id for application_with_lease
  application_without_lease = 'a0o0P00000ItlpiQAB' # Random application
  lease_id_length = 18
  describe '#create' do
    it 'updates existing lease if application has lease' do
      VCR.use_cassette('api/v1/leases/create/app-with-lease') do
        params = {
          application_id: application_with_lease,
          lease: {
            'monthly_parking_rent': 100,
          },
        }
        post :create, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease']['monthly_parking_rent']).to eq(100)
    end
    it 'creates a new lease if application doesn\'t have lease' do
      VCR.use_cassette('api/v1/leases/create/app-without-lease') do
        params = {
          application_id: application_without_lease,
          lease: {
            'monthly_parking_rent': 100,
          },
        }
        post :create, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease']['id'].size).to eq(lease_id_length) # create returns lease id
    end
  end

  describe '#update' do
    it 'updates a lease successfully' do
      updated_monthly_rent = 100
      VCR.use_cassette('api/v1/leases/update/app-with-lease') do
        params = {
          id: application_with_lease,
          application_id: application_with_lease,
          lease: {
            'id': test_lease_id,
            'monthly_parking_rent': updated_monthly_rent,
          },
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease']['id']).to eq(test_lease_id)
      expect(json['lease']['monthly_parking_rent']).to eq(updated_monthly_rent)
    end
  end
end
