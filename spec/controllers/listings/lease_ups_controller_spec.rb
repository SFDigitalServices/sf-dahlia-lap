require 'rails_helper'

RSpec.describe Listings::LeaseUpsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should rendering succesfully' do
      VCR.use_cassette('listings/lease_ups_controller/index') do
        get :index, params: { listing_id: valid_listing_id }
      end

      expect(response.body).to have_react_component('LeaseUpsPage')
      expect(response).to have_http_status(:success)
    end

    it 'should handle error' do
      VCR.use_cassette('listings/lease_ups_controller/index_error') do
        get :index, params: { listing_id: invalid_listing_id }
      end

      expect(response).to have_http_status(:not_found)
    end
  end
end
