# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::SupplementalsController, type: :controller do
  render_views
  login_admin

  describe '#show' do
    let(:expected_supplemental_lease_up_app) { fixture('controllers/api/v1/supplementals/show.json') }

    it 'should return a supplemental application' do
      VCR.use_cassette('api/supplementals_controller/show/supplemental_application') do
        get :show, params: { id: lease_up_application_id }
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      application = json['application']

      expect(json['file_base_url']).not_to be_empty
      expect(application).not_to be_empty
      expect(application['rental_assistances']).to be_nil
      expect(application['preferences']).not_to be_empty
      expect(application['proof_files']).not_to be_empty
      expect(application['lease']).to be_nil
      expect(application['household_members'].length).to eq(0)

      # Checking large sub-objects individually before checking entire application equality simplifies
      # the diff output when running tests locally.
      expect(application['applicant']).to eq(expected_supplemental_lease_up_app['applicant'])
      expect(application['alternate_contact']).to eq(expected_supplemental_lease_up_app['alternate_contact'])
      expect(application['preferences']).to eq(expected_supplemental_lease_up_app['preferences'])

      expect(application).to eq(expected_supplemental_lease_up_app)
    end
  end
end
