# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LeaseUpApplicationsController, type: :controller do
  render_views
  login_admin

  lease_up_listing = 'a0W0P00000GbyuQ' # Lease up Listing

  describe '#index' do
    it 'returns only applications with preferences where Receives_Preference is true' do
      VCR.use_cassette('/api/v1/lease-ups/applications') do
        params = {
          listing_id: lease_up_listing,
          page: 0,
        }
        get :index, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      all_records_receive_preferences = json['records'].all? { |r| (r['Receives_Preference'] == true) }
      expect(all_records_receive_preferences).to eq(true)
    end
  end
end
