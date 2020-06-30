# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ShortFormController, type: :controller do
  login_admin
  application = {
    applicant: {
      marital_status: 'Single',
      id: 'a0n0P00000DowdHQAR'
    },
    has_military_service: 'Yes',
    reserved_senior: 'Yes',
    has_ada_priorities_selected: {vision_impairments: true},
    number_of_dependents: 2,
    number_of_seniors: 2,
    confirmed_household_annual_income: 123,
    id: 'a0o0P00000JQawYQAT'
  }

  describe '#submit' do
    describe 'application to pre-lottery listing' do
      it 'receives a successful response from Salesforce' do
        VCR.use_cassette('api/v1/short-form/submit/pre-lottery/success') do
          put :submit, params: { application: application }
        end
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['application']).not_to be_empty
      end
      # TODO: Consider making this an update to an application on Yellow acres to make this more realistic.
      describe 'with supplemental param' do
        it 'receives a successful response with updated application from Salesforce' do
          VCR.use_cassette('api/v1/short-form/submit/pre-lottery/with-supplemental-param') do
            put :submit, params: { application: application, supplemental: true }
          end
          expect(response).to have_http_status(:success)
          json = JSON.parse(response.body)
          expect(json['application']).not_to be_empty
          expect(json['application']['application_submission_type']).to eq('Paper')
        end
      end
    end
  end
end
