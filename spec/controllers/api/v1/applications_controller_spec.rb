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
end
