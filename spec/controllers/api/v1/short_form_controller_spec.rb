# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ShortFormController, type: :controller do
  login_admin
  application = {
    applicant: {
      marital_status: 'Single',
      id: 'a0n0P00000DowdHQAR'
    },
    number_of_dependents: 2,
    number_of_seniors: 2,
    confirmed_household_annual_income: 123,
    has_military_service: 'Yes',
    reserved_senior: 'Yes',
    has_ada_priorities_selected: {vision_impairments: true},
    id: 'a0o0P00000JQawYQAT'
  }
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

  describe '#show' do
    context 'with a lease up application' do
      let(:expected_lease_up_app) { fixture('controllers/applications/lease_up_application_domain.json') }

      it 'should return a domain application snapshot' do
        VCR.use_cassette('api/v1/short-form/show/lease_up_application') do
          get :show, params: { id: lease_up_application_id }
        end

        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)

        domain_application = json['application']
        expect(domain_application['preferences']).to eq(expected_lease_up_app['preferences'])
        expect(domain_application).to eq(expected_lease_up_app)
        expect(domain_application['is_snapshot']).to be true
      end
    end

    context 'with a non lease up application' do
      let(:expected_non_lease_up_app) { fixture('controllers/applications/non_lease_up_application_domain.json') }

      it 'should return a domain application' do
        VCR.use_cassette('api/v1/short-form/show/non_lease_up_application') do
          get :show, params: { id: non_lease_up_application_id }
        end


        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        domain_application = json['application']
        expect(domain_application['preferences']).to eq(expected_non_lease_up_app['preferences'])
        expect(domain_application).to eq(expected_non_lease_up_app)
        expect(domain_application['is_snapshot']).to be false
      end
    end

    context 'with a sale application' do
      let(:expected_sale_app) { fixture('controllers/applications/sale_application_domain.json') }

      it 'should return a domain application' do
        VCR.use_cassette('api/v1/short-form/show/sale_application') do
          get :show, params: { id: sale_application_id }
        end

        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        domain_application = json['application']
        expect(domain_application['preferences']).to eq(expected_sale_app['preferences'])
        expect(domain_application).to eq(expected_sale_app)
        expect(domain_application['listing']['is_sale']).to be_truthy
      end
    end
  end

  describe '#submit' do
    describe 'application to pre-lottery listing' do
      it 'receives a successful response from Salesforce' do
        VCR.use_cassette('api/v1/short-form/submit/pre-lottery/success') do
          post :submit, params: { application: new_application }, as: :json
        end
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['application']).not_to be_empty
      end

      it 'calls post method' do
        expect_any_instance_of(Force::Base).to receive(:api_post).and_call_original
        VCR.use_cassette('api/v1/short-form/submit/pre-lottery/success') do
          post :submit, params: { application: new_application }, as: :json
        end
      end

      describe 'with supplemental param' do
        it 'receives a successful response with updated application from Salesforce' do
          VCR.use_cassette('api/v1/short-form/submit/pre-lottery/with-supplemental-param') do
            put :submit, params: { application: application, supplemental: true }, as: :json
          end
          expect(response).to have_http_status(:success)
          json = JSON.parse(response.body)
          expect(json['application']).not_to be_empty
          expect(json['application']['application_submission_type']).to eq('Paper')
        end

        it 'calls put method' do
          expect_any_instance_of(Force::Base).to receive(:api_put).and_call_original
          VCR.use_cassette('api/v1/short-form/submit/pre-lottery/with-supplemental-param') do
            put :submit, params: { application: application, supplemental: true }, as: :json
          end
        end
      end
    end
  end
end
