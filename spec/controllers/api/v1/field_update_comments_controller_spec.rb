# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::FieldUpdateCommentsController, type: :controller do
  render_views
  login_admin

  let(:expected_status_updates) { fixture('controllers/api/v1/applications/field_update_comments.json') }
  describe '#create' do
    it 'it should create a field update comment and return the field update comments for the application' do
      VCR.use_cassette('api/field_update_comments_controller/create') do
        post :create, params: {
          application_id: field_update_comments_application_id,
          field_update_comment: {
            status: 'Withdrawn',
            comment: 'rspec test comment',
            application: field_update_comments_application_id,
            substatus: 'Verbal withdrawal',
          }
        }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['result']).to eq(expected_status_updates)
    end
  end

  describe '#index' do
    it 'should return a supplemental application' do
      VCR.use_cassette('api/field_update_comments_controller/index') do
        get :index, params: { application_id: field_update_comments_application_id }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data']).to eq(expected_status_updates)
    end
  end

end
