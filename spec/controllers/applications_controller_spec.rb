require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should rendering succesfully' do
      VCR.use_cassette('applications_controller/index') do
        get :index
      end

      expect(response.body).to have_react_component('ApplicationsPage')
      expect(response).to have_http_status(:success)
      expect(assigns(:listings)).to be_present
    end
  end

  # describe '#show' do
  #   it 'should rendering succesfully' do
  #     VCR.use_cassette('listings_controller/show') do
  #       get :index, params: { listing_id: valid_listing_id }
  #     end
  #
  #     expect(response.body).to have_react_component('LeaseUpsPage')
  #     expect(response).to have_http_status(:success)
  #   end
  #
  #   it 'should handle error' do
  #     VCR.use_cassette('listings_controller/index_errors') do
  #       get :index, params: { listing_id: invalid_listing_id }
  #     end
  #
  #     expect(response).to have_http_status(:not_found)
  #   end
  # end
end
