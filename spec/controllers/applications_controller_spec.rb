# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#show' do
    it 'should render successfully' do
      VCR.use_cassette('applications_controller/show') do
        get :show, params: { id: valid_application_id }
      end

      expect(response.body).to have_react_component('ApplicationPage')
      expect(response).to have_http_status(:success)
    end
  end
end
