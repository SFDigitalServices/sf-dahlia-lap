# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Applications::SupplementalsController, type: :controller do
  render_views
  login_admin

  describe '#show' do
    it 'should render the page successfully' do
      VCR.use_cassette('controllers/supplementals/show') do
        get :show, params: { application_lease_up_id: lease_up_application_id }
      end

      expect(response.body).to have_react_component('LeaseUpApp')
      expect(response).to have_http_status(:success)
    end
  end
end
