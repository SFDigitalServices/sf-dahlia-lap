# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LotteryResultsPdfGeneratorController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    it 'should render successfully' do
      VCR.use_cassette('lottery_results_pdf_generator_controller/index') do
        get :index, params: { id: valid_listing_id }
      end

      expect(response.body).to have_react_component('LotteryResultsPdfGenerator')
      expect(response).to have_http_status(:success)
    end
  end
end
