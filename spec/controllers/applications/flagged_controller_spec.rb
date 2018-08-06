# require 'rails_helper'
#
# RSpec.describe Applications::FlaggedController, type: :controller do
#   let(:listing_id) { 'a0W0P00000DZfSpUAL' }
#
#   render_views
#   login_admin
#
#   describe '#index' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('applications/flagged_controller/index') do
#         get :index, params: { listing_id: listing_id }
#       end
#
#       expect(response.body).to have_react_component('LeaseUpsPage')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('applications/flagged_controller/index_errors') do
#         get :index, params: { listing_id: 'a0W0P00000DZfSpXXX' }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
#
#   describe '#show' do
#     it 'should rendering succesfully' do
#       VCR.use_cassette('applications/flagged_controller/show') do
#         get :index, params: { listing_id: listing_id }
#       end
#
#       expect(response.body).to have_react_component('LeaseUpsPage')
#       expect(response).to have_http_status(:success)
#     end
#
#     it 'should handle error' do
#       VCR.use_cassette('applications/flagged_controller/show_errors') do
#         get :index, params: { listing_id: 'a0W0P00000DZfSpXXX' }
#       end
#
#       expect(response).to have_http_status(:not_found)
#     end
#   end
# end
