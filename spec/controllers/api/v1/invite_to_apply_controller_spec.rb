# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::InviteToApplyController, type: :controller do
  login_admin

  describe '#email' do
    listing = {
      name: 'TEST Partners Listing',
      neighborhood: 'Castro/Upper Market',
      building_street_address: '1 South Van Ness Ave',
      lottery_date: '2020-01-01',
      file_upload_url: 'http://sf.gov',
    }

    it 'should return status 200 if email is sent to dahlia backend successfully' do
      VCR.use_cassette('api/v1/invite_to_apply_controller/email/success') do
        listing[:id] = lease_up_listing_id
        params = {
          ids: [lease_up_application_id],
          listing: listing,
        }
        post :email, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'should return status 500 if ids parameter is missing' do
      listing[:id] = lease_up_listing_id
      post :email, params: { listing: listing }

      expect(response).to have_http_status(:internal_server_error)
    end

    it 'should return status 500 if the listing returns 0 contacts' do
      VCR.use_cassette('api/v1/invite_to_apply_controller/email/failure_zero_contacts') do
        listing[:id] = 'a0W0P00000GbyuXXXX' # invalid id causes contacts query to return 0 records
        post :email, params: {
          ids: ['a0W0P00000GbyuXXXX'],
          listing: listing,
        }
      end

      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
