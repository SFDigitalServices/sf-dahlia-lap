# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::FlaggedApplicationsController, type: :controller do
  login_admin

  describe '#index' do
    it 'should render successfully' do
      VCR.use_cassette('api/v1/flagged_applications_controller/index') do
        get :index, params: { type: 'pending' }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['title'].size).to be_truthy
      expect(json['flagged_records'].size).to eq(2772)
    end
  end

  describe '#record_set' do
    it 'should render successfully' do
      VCR.use_cassette('api/v1/flagged_applications_controller/record_set') do
        get 'record_set', params: { id: flagged_record_set_id }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['flagged_records'].size).to eq(2)
    end
  end

  describe '#update' do
    it 'should render true if update is successful' do
      VCR.use_cassette('api/v1/flagged_applications_controller/update/success') do
        params = {
          id: field_update_comments_flagged_application_id,
          flagged_application: {
            id: field_update_comments_flagged_application_id,
            review_status: 'Pending Review',
            comments: 'test comment',
          },
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'should render an error if update is unsuccessful' do
      VCR.use_cassette('api/v1/flagged_applications_controller/update/success') do
        params = {
          id: 'invalid_id',
          flagged_application: {
            id: 'invalid_id',
            review_status: 'test review status',
            comments: 'test comment',
          },
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:service_unavailable)
      json = JSON.parse(response.body)
      expect(json['message']).to include('NOT_FOUND')
    end
  end
end
