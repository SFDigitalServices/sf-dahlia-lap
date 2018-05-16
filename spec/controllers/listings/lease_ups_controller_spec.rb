require 'rails_helper'

RSpec.describe Listings::LeaseUpsController, type: :controller do
  let(:listing_id) { 'a0W0P00000DZfSpUAL' }

  render_views
  login_admin

  describe '#index' do
    it 'should rendering succesfully' do
      VCR.use_cassette('lease_ups/index') do
        get :index, params: { listing_id: listing_id }
      end

      has_react_component(response.body, 'LeaseUpsPage')
      expect(response).to have_http_status(:success)
    end

    it 'should handle error' do
      VCR.use_cassette('lease_ups/index_errors') do
        get :index, params: { listing_id: 'a0W0P00000DZfSpXXX' }
      end

      expect(response).to have_http_status(:not_found)
    end
  end
end
