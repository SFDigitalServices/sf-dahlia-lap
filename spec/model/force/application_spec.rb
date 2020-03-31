# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Application do
  let(:paper_app_custom_api) { fixture('model/force/application/paper_app_custom_api.json') }
  let(:paper_app_domain) { fixture('model/force/application/paper_app_domain.json') }
  let(:app_salesforce) { fixture('model/force/application/app_salesforce.json') }
  let(:app_domain_from_salesforce) { fixture('model/force/application/app_domain_from_salesforce.json') }
  let(:app_domain_from_custom_api) { fixture('model/force/application/app_domain_from_custom_api.json') }

  describe '#to_domain' do
    it 'should convert from custom API fields to domain' do
      application = Force::Application.from_custom_api(paper_app_custom_api)
      domain_application = application.to_domain

      expect(domain_application).to eq(app_domain_from_custom_api)
    end

    it 'should convert from Salesforce fields to domain' do
      application = Force::Application.from_salesforce(app_salesforce)
      domain_application = application.to_domain

      expect(domain_application).to eq(app_domain_from_salesforce)
    end
  end

  describe '#to_custom_api' do
    describe 'from domain' do
      it 'should convert from domain to custom API for new paper applications' do
        application = Force::Application.from_domain(paper_app_domain)
        api_application = application.to_custom_api

        expect(api_application).to eq(paper_app_custom_api)
      end

      it 'should convert application as expected with no fields present' do
        application = Force::Application.from_domain({})
        expect(application.to_custom_api).to eq ({})
      end

      it 'should convert ADA priorities if some are selected' do
        domain_ada_priorities = {
          "has_ada_priorities_selected": {
            "vision_impairments": true,
            "mobility_impairments": false,
            "hearing_impairments": true
          }
        }
        application = Force::Application.from_domain(domain_ada_priorities)
        api_application = application.to_custom_api

        expected_ada_priorities = "Vision impairments;Hearing impairments"
        expect(api_application['adaPrioritiesSelected']).to eq(expected_ada_priorities)
      end

      it 'should convert ADA priorities if none are selected' do
        domain_ada_priorities = {
          "has_ada_priorities_selected": {
            "vision_impairments": false,
            "mobility_impairments": false,
            "hearing_impairments": false
          }
        }
        application = Force::Application.from_domain(domain_ada_priorities)
        api_application = application.to_custom_api
        expect(api_application['adaPrioritiesSelected']).to eq('')
      end

      it 'does not include alternateContact if it\'s empty or missing' do
        domain_app = {
          'id': 'something',
        }
        application = Force::Application.from_domain(domain_app)
        expect(application.to_custom_api['alternateContact']).to be_nil

        domain_app = {
          'alternate_contact': {},
        }
        application = Force::Application.from_domain(domain_app)
        expect(application.to_custom_api['alternateContact']).to be_nil
      end

      it 'does not include alternateContact if it contains only empty strings' do
        domain_app = {
          'id': 'something',
          'alternate_contact': {'first_name': ''}
        }
        application = Force::Application.from_domain(domain_app)
        expect(application.to_custom_api['alternateContact']).to be_nil
      end
    end
  end
end
