# require 'rails_helper'
#
# RSpec.describe ListingsController, type: :controller do
#   render_views
#   login_admin
#
#   let(:listing_id) { 'a0W0P00000DZfSpUAL' }
#
#   describe '#index' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('listings_controller/index') do
#         get :index, params: { listing_id: listing_id }
#       end
#
#       expect(response.body).to have_react_component('LeaseUpsPage')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('listings_controller/index_errors') do
#         get :index, params: { listing_id: 'a0W0P00000DZfSpXXX' }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
#
#   describe '#show' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('listings_controller/show') do
#         get :index, params: { listing_id: listing_id }
#       end
#
#       expect(response.body).to have_react_component('LeaseUpsPage')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('listings_controller/index_errors') do
#         get :index, params: { listing_id: 'a0W0P00000DZfSpXXX' }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
# end
