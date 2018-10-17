require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#show' do
    let(:application_id) { {} }
    let(:expected_domain_application) { {} }

    it 'should return a domain application' do
      VCR.use_cassette('applications_controller/sho') do
        get :show, params: { id: valid_application_id }

        domain_application = assigns(:application)
        expect(domain_application).to eq(expected_domain_application)
      end
    end

    it 'should render successfully' do
      VCR.use_cassette('applications_controller/show') do
        get :show, params: { id: valid_application_id }
      end

      expect(response.body).to have_react_component('ApplicationPage')
      expect(response).to have_http_status(:success)
    end
  end
end
