require 'rails_helper'

RSpec.describe Force::ApplicationMember do
  let(:domain_attributes) { fixture('application_member_domain.json') }
  let(:custom_api_attributes) { fixture('application_member_custom_api.json') }
  let(:salesforce_attributes) { fixture('application_member_salesforce.json') }

  describe '#to_domain' do
    it 'should convert from Salesforce fields' do
      application = Force::ApplicationMember.from_salesforce(salesforce_attributes)
      attributes = application.to_domain
      expect(attributes).to eq(domain_attributes)
    end

    it 'should convert from custom API fields' do
      application = Force::ApplicationMember.from_custom_api(custom_api_attributes)
      attributes = application.to_domain
      expect(attributes).to eq(domain_attributes)
    end
  end
end
