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
        units = assigns(:units)
        available_units = assigns(:available_units)

        expect(application['rental_assistances']).not_to be_empty
        expect(units).not_to be_empty
        expect(available_units).not_to be_empty

        expect(application['preferences']).not_to be_empty
        expect(application['proof_files']).not_to be_empty
        expect(application['lease']).not_to be_empty
        expect(application['household_members'].length).to eq(0)

        # Checking large sub-objects individually before checking entire application equality simplifies
        # the diff output when running tests locally.
        expect(application['applicant']).to eq(expected_supplemental_lease_up_app['applicant'])
        expect(application['alternate_contact']).to eq(expected_supplemental_lease_up_app['alternate_contact'])
        expect(application['rental_assistances']).to eq(expected_supplemental_lease_up_app['rental_assistances'])
        expect(application['preferences']).to eq(expected_supplemental_lease_up_app['preferences'])
        expect(application['rental_assistances']).to eq(expected_supplemental_lease_up_app['rental_assistances'])

        expect(application).to eq(expected_supplemental_lease_up_app)
      end
    end
  end
end
