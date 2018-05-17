# require 'rails_helper'
#
# RSpec.describe Listings::ApplicationsController, type: :controller do
#   render_views
#   login_admin
#
#   describe '#index' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('listings/applications_controller/index') do
#         get :index, params: { listing_id: valid_listing_id }
#       end
#
#       expect(response.body).to have_react_component('IndexTable')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('lease_ups/index_errors') do
#         get :index, params: { listing_id: invalid_listing_id }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
#
#   describe '#new' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('listings/applications_controller/new') do
#         get :new, params: { listing_id: valid_listing_id }
#       end
#
#       expect(response.body).to have_react_component('PaperApplicationForm')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('lease_ups/index_errors') do
#         get :new, params: { listing_id: invalid_listing_id }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
# end
