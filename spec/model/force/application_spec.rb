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
      application = Force::Application.from_salesforce(soql_attributes)
      attributes = application.to_domain

      ap attributes

      # attributes['preferences'].each_with_index do |_, idx|
      #   expect(attributes['preferences'][idx]).to eq(domain_attributes['preferences'][idx])
      # end
      # # expect(attributes['applicant']).to eq(domain_attributes['applicant'])
      # expect(attributes['preferences']).to eq(domain_attributes['preferences'])

      attributes.delete('preferences')
      domain_attributes.delete('preferences')
      expect(attributes).to eq(domain_attributes)
    end
  end
end
