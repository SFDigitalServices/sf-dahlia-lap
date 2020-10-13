# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Applications::SupplementalsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should pass the application ID to the frontend' do
      get :index, params: { application_id: lease_up_application_id }
      application_id = assigns(:application_id)
      expect(application_id).to eq(lease_up_application_id)
    end
  end
end
