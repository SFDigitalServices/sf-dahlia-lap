# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Application do
  describe '#to_domain' do
    let(:app_custom_api) { fixture('model/force/application/app_custom_api.json') }
    let(:app_salesforce) { fixture('model/force/application/app_salesforce.json') }
    let(:app_domain_from_custom_api) { fixture('model/force/application/app_domain_from_custom_api.json') }
    let(:app_domain_from_salesforce) { fixture('model/force/application/app_domain_from_salesforce.json') }

    it 'should convert from custom API fields to domain' do
      application = Force::Application.from_custom_api(app_custom_api)
      domain_application = application.to_domain

      expect(domain_application).to eq(app_domain_from_custom_api)
    end

    it 'should convert from Salesforce fields to domain' do
      application = Force::Application.from_salesforce(app_salesforce)
      domain_application = application.to_domain

      expect(domain_application).to eq(app_domain_from_salesforce)
    end
  end
end
