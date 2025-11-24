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
      leasing_agent_name: 'leasing agent name',
      leasing_agent_email: 'leasing_agent@emailtest2468.com',
      leasing_agent_phone: '415-867-5309',
      office_hours: 'M-F 9am-5pm',
    }

    it 'should return status 200 if email is sent to dahlia backend successfully' do
      VCR.use_cassette('api/v1/invite_to_apply_controller/email/success') do
        listing[:id] = lease_up_listing_id
        params = {
          applicationIds: [lease_up_application_id],
          listing: listing,
          invite_to_apply_deadline: '2050-01-01',
        }
        post :email, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'should send a test email successfully' do
      VCR.use_cassette('api/v1/invite_to_apply_controller/email/test_email_success') do
        listing[:id] = lease_up_listing_id
        params = {
          applicationIds: [lease_up_application_id],
          listing: listing,
          invite_to_apply_deadline: '2050-01-01',
          isTest: true,
          testEmail: 'test@emailtest2468.com',
        }
        post :email, params: params
      end
      expect(response).to have_http_status(:success)
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
          applicationIds: ['a0W0P00000GbyuXXXX'],
          listing: listing,
        }
      end

      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
