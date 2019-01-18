# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Applications::SupplementalsController, type: :controller do
  render_views
  login_admin

  describe '#index' do
    let(:expected_supplemental_lease_up_app) { fixture('controllers/supplementals/index.json') }

    it 'should return a supplemental application' do
      VCR.use_cassette('supplementals_controller/index/supplemental_application') do
        get :index, params: { application_id: lease_up_application_id }
        application = assigns(:application)
        rental_assistances = assigns(:rental_assistances)
        units = assigns(:units)
        available_units = assigns(:available_units)

        expect(rental_assistances).not_to be_empty
        expect(units).not_to be_empty
        expect(available_units).not_to be_empty

        expect(application['preferences']).not_to be_empty
        expect(application['proof_files']).not_to be_empty
        expect(application['lease']).not_to be_empty
        expect(application['household_members'].length).to eq(0)
        expect(application).to eq(expected_supplemental_lease_up_app)
      end
    end
  end
end
