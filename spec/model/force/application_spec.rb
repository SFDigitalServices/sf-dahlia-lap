require 'rails_helper'

RSpec.describe Force::Application do
  describe '#to_domain' do
    let(:app_salesforce_to_domain) { fixture('app_salesforce_to_domain.json') }
    # let(:app_domain_to_custom_api) { fixture('app_domain_to_custom_api.json') }
    let(:app_domain_to_salesforce) { fixture('app_domain_to_salesforce.json') }

    # pending 'should convert from custom api' do
    #   application = Force::Application.new(custom_api_attributes, :custom_api)
    #
    #   expect(application.to_domain).to eq(domain_attributes)
    # end

    it 'should convert from Salesforce fields to domain' do
      application = Force::Application.from_salesforce(app_salesforce_to_domain)
      attributes = application.to_domain

      # ap attributes

      # expect(attributes['preferences']).to be_present
      # attributes['preferences'].each_with_index do |_, idx|
      #   expect(attributes['preferences'][idx]).to eq(domain_attributes['preferences'][idx])
      # end
      # expect(attributes['applicant']).to eq(domain_attributes['applicant'])
      # expect(attributes['preferences']).to eq(domain_attributes['preferences'])
      #
      # attributes.delete('preferences')
      # domain_attributes.delete('preferences')
      expect(attributes).to eq(domain_attributes)
    end

    it 'should convert from custom API fields' do
      application = Force::Application.from_custom_api(custom_api_attributes)
      attributes = application.to_domain

      ap attributes

      # attributes['preferences'].each_with_index do |_, idx|
      #   expect(attributes['preferences'][idx]).to eq(domain_attributes['preferences'][idx])
      # end
      # expect(attributes['applicant']).to eq(domain_attributes['applicant'])
      # expect(attributes['preferences']).to eq(domain_attributes['preferences'])

      # attributes.delete('preferences')
      # domain_attributes.delete('preferences')
      expect(attributes).to eq(domain_attributes)
    end
  end
end
