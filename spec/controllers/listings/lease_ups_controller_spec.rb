require 'rails_helper'

RSpec.describe Listings::LeaseUpsController, type: :controller do
  let(:listing_id) { 'xxxxx1' }

  render_views
  login_admin

  pending '#index' do
    it 'should rendering succesfully' do
      get :index, params: { listing_id: listing_id }

      expect(response).to have_http_status(:success)
    end
  end
end
