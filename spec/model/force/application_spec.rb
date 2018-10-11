require 'rails_helper'

RSpec.describe Force::Application do
  describe '#to_domain' do
    let(:domain_attributes) { fixture('application_domain.json') }
    let(:custom_api_attributes) { fixture('application_custom_api.json') }
    let(:soql_attributes) { fixture('application_soql.json') }

    pending 'should convert from custom api' do
      application = Force::Application.new(custom_api_attributes, :custom_api)

      expect(application.to_domain).to eq(domain_attributes)
    end
    it 'should convert from SOQL' do
      application = Force::Application.new(soql_attributes, :soql)

      expect(application.to_domain).to eq(domain_attributes)
    end
  end
end
