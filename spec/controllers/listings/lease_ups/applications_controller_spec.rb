# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Listings::LeaseUps::ApplicationsController, type: :controller do
  routes { Rails.application.routes }
  render_views
  login_admin

  describe 'load_listing_on_lease_up_page' do
    context 'when BANNER_INVITE_TO_APPLY_FEEDBACK is true' do
      before do
        allow(ENV).to receive(:[]).and_call_original
        allow(ENV).to receive(:[]).with('BANNER_INVITE_TO_APPLY_FEEDBACK').and_return('true')
      end

      it 'should show i2a banner for inclusionary lease up rental' do
        VCR.use_cassette('lease_ups/listings/index') do
          get :index, params: { lease_up_id: lease_up_listing_id }
        end

        expect(response.body).to include('Sending emails from DAHLIA is new ')
        expect(response).to have_http_status(:success)
      end
    end

    context 'when BANNER_INVITE_TO_APPLY_FEEDBACK is false' do
      before do
        allow(ENV).to receive(:[]).and_call_original
        allow(ENV).to receive(:[]).with('BANNER_INVITE_TO_APPLY_FEEDBACK').and_return('false')
      end

      it 'should not show i2a banner for inclusionary lease up rental' do
        VCR.use_cassette('lease_ups/listings/index') do
          get :index, params: { lease_up_id: lease_up_listing_id }
        end

        expect(response.body).not_to include('Sending emails from DAHLIA is new ')
        expect(response).to have_http_status(:success)
      end
    end
  end
end
