require 'rails_helper'

RSpec.describe Api::V1::ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should rendering succesfully' do
      VCR.use_cassette('api/v1/applications_controller/index') do
        get :index
      end

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['records'].size).to eq(100)
    end
  end
end
