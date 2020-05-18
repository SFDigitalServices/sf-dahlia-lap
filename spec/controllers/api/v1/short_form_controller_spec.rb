# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ShortFormController, type: :controller do
  login_admin
  pre_lottery_listing_id = 'a0W0P00000F8YG4UAN' # Automated Test Listing
  new_application = {
    application_submission_type: 'Paper',
    application_submitted_date: '2019-03-12',
    status: 'Submitted',
    listing_id: pre_lottery_listing_id,
    annual_income: 110_000,
    application_language: 'English',
    applicant: {
      first_name: 'Test',
      last_name: 'Supp app test',
      email: 'eee@eeee.com',
      date_of_birth: { day: 1, year: 1950, month: 1 },
      address: '123 MAIN ST',
      city: 'SAN FRANCISCO',
      state: 'CA',
      zip_code: '94105-1804',
    },
    household_members: [
      {
        first_name: 'member',
        last_name: 'test',
        date_of_birth: { day: 11, year: 1976, month: 6 },
      },
    ],
    shortForm_preferences: [],
  }

  describe '#submit' do
    describe 'application to pre-lottery listing' do
      it 'receives a successful response from Salesforce' do
        VCR.use_cassette('api/v1/short-form/submit/pre-lottery/success') do
          post :submit, params: { application: new_application }
        end
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['application']).not_to be_empty
      end
      # TODO: Consider making this an update to an application on Yellow acres to make this more realistic.
      describe 'with supplemental param' do
        it 'receives a successful response with updated application from Salesforce' do
          VCR.use_cassette('api/v1/short-form/submit/pre-lottery/with-supplemental-param') do
            post :submit, params: { application: new_application, supplemental: true }
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
