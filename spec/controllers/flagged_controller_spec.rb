# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Applications::FlaggedController, type: :controller do
  login_admin

  describe '#index' do
    it 'should render successfully' do
      expect(response).to have_http_status(:success)
    end
  end

  describe '#show' do
    it 'should render successfully' do
      expect(response).to have_http_status(:success)
    end
  end
end
