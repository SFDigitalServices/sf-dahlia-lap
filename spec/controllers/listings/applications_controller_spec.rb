# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Listings::ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should render successfully' do
      VCR.use_cassette('listings/applications_controller/index') do
        get :index, params: { listing_id: valid_listing_id }
      end

      expect(response.body).to have_react_component('ListingApplicationsPage')
      expect(response).to have_http_status(:success)
    end

    it 'should handle not found errors' do
      VCR.use_cassette('listings/applications_controller/index_errors') do
        get :index, params: { listing_id: nonexistent_listing_id }
      end

      expect(response).to have_http_status(:not_found)
    end
  end

  describe '#new' do
    it 'should render successfully' do
      VCR.use_cassette('listings/applications_controller/new') do
        get :new, params: { listing_id: not_yet_run_listing_id }
      end

      listing = assigns(:listing)
      expect(listing[:is_sale]).to be_falsey
      expect(listing[:is_rental]).to be_truthy
      expect(response.body).to have_react_component('ApplicationNewPage')
      expect(response).to have_http_status(:success)
    end

    it 'should render sale listing successfully' do
      VCR.use_cassette('listings/applications_controller/new_sale') do
        get :new, params: { listing_id: sale_listing_id }
      end

      listing = assigns(:listing)
      expect(listing[:is_sale]).to be_truthy
      expect(listing[:is_rental]).to be_falsey
      expect(response.body).to have_react_component('ApplicationNewPage')
      expect(response).to have_http_status(:success)
    end

    it 'should handle not found errors' do
      VCR.use_cassette('listings/applications_controller/index_errors') do
        get :new, params: { listing_id: nonexistent_listing_id }
      end

      expect(response).to have_http_status(:not_found)
    end
  end
end
