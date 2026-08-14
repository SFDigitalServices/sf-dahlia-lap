# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::RentalAssistancesController, type: :controller do
  login_admin

  describe '#index' do
    let(:rental_assistance_service) { instance_double(Force::Soql::RentalAssistanceService) }
    let(:application_id) { non_lease_up_application_id }

    it 'does not create or query leases when loading rental assistances for an application view' do
      allow(controller).to receive(:soql_rental_assistance_service).and_return(rental_assistance_service)
      allow(rental_assistance_service).to receive(:application_rental_assistances).with(application_id).and_return([])

      expect(controller).not_to receive(:find_or_create_application_lease)
      expect(controller).not_to receive(:soql_lease_service)
      expect(controller).not_to receive(:rest_lease_service)

      get :index, params: { application_id: application_id }

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to eq('rental_assistances' => [])
    end
  end
end
