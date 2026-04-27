# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::MessageController, type: :controller do
  login_admin

  describe '#email' do
    let(:request_params) do
      {
        applicationIds: [lease_up_application_id],
      }
    end

    it 'returns status 200 when message service succeeds' do
      allow(DahliaBackend::MessageService).to receive(:send_invite).and_return(true)

      post :email, params: request_params

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq(true)
    end

    it 'calls message service with current user and params' do
      expect(DahliaBackend::MessageService).to receive(:send_invite) do |user, params|
        expect(user).to eq(controller.current_user)
        expect(params[:applicationIds]).to eq([lease_up_application_id])

        true
      end

      post :email, params: request_params
    end

    it 'returns status 500 if ids parameter is missing' do
      expect(DahliaBackend::MessageService).not_to receive(:send_invite)

      post :email, params: {}

      expect(response).to have_http_status(:internal_server_error)
    end

    it 'returns status 500 when message service fails' do
      allow(DahliaBackend::MessageService).to receive(:send_invite).and_return(nil)

      post :email, params: request_params

      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
