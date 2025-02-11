# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should render successfully' do
      VCR.use_cassette('applications/index') do
        get :index, params: { id: valid_listing_id }
      end

      expect(response.body).to have_react_component('ApplicationsPage')
      expect(response).to have_http_status(:success)
    end
  end

  describe '#show' do
    it 'should render successfully' do
      VCR.use_cassette('api/v1/short-form/show/non_lease_up_application') do
        get :show, params: { id: non_lease_up_application_id }
      end

      expect(response.body).to have_react_component('LeaseUpApp')
      expect(response).to have_http_status(:success)
    end
  end

  describe '#edit' do
    it 'should redirect on electronic application type' do
      VCR.use_cassette('applications_controller/edit/non_lease_up_application') do
        get :edit, params: { id: non_lease_up_application_id }
      end

      expect(response).to have_http_status(:found)
      expect(response).to redirect_to('http://test.host/applications/a0o0P00000Fv20MQAR')
    end
    it 'should redirect on paper application and lottery completed' do
      VCR.use_cassette('applications_controller/edit/paper_app_lottery_complete_application') do
        get :edit, params: { id: paper_app_lottery_complete_id }
      end

      expect(response).to have_http_status(:found)
      expect(response).to redirect_to('http://test.host/applications/a0o0P00000GZawFQAT')
    end
  end
end
