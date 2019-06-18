# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#show' do
    context 'with a lease up application' do
      let(:expected_lease_up_app) { fixture('controllers/applications/lease_up_application_domain.json') }

      it 'should return a domain application snapshot' do
        VCR.use_cassette('applications_controller/show/lease_up_application') do
          get :show, params: { id: lease_up_application_id }

          domain_application = assigns(:application)
          expect(domain_application).to eq(expected_lease_up_app)
          expect(domain_application.is_snapshot).to be true
        end
      end
    end

    context 'with a non lease up application' do
      let(:expected_non_lease_up_app) { fixture('controllers/applications/non_lease_up_application_domain.json') }

      it 'should return a domain application' do
        VCR.use_cassette('applications_controller/show/non_lease_up_application') do
          get :show, params: { id: non_lease_up_application_id }

          domain_application = assigns(:application)
          expect(domain_application).to eq(expected_non_lease_up_app)
          expect(domain_application.is_snapshot).to be false
        end
      end
    end

    it 'should render successfully' do
      VCR.use_cassette('applications_controller/show/non_lease_up_application') do
        get :show, params: { id: non_lease_up_application_id }
      end

      expect(response.body).to have_react_component('ApplicationPage')
      expect(assigns(:application).listing['is_sale']).to be_falsey
      expect(response).to have_http_status(:success)
    end

    context 'with a sale application' do
      let(:expected_sale_app) { fixture('controllers/applications/sale_application_domain.json') }

      it 'should return a domain application' do
        VCR.use_cassette('applications_controller/show/sale_application') do
          get :show, params: { id: sale_application_id }

          domain_application = assigns(:application)
          expect(domain_application).to eq(expected_sale_app)
          expect(assigns(:application).listing['is_sale']).to be_truthy
        end
      end
    end
  end

  describe '#edit' do
    it 'should redirect on lottery completed' do
      VCR.use_cassette('applications_controller/edit/non_lease_up_application') do
        get :edit, params: { id: non_lease_up_application_id }
      end

      expect(response.body).to include('redirected')
      expect(response).to have_http_status(:redirect)
    end
  end
end
