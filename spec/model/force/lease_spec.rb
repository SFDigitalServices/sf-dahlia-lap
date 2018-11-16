# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Lease do
  describe '#to_domain' do
    let(:lease_domain) { fixture('model/force/lease/lease_domain.json') }
    let(:lease_salesforce_from_domain) { fixture('model/force/lease/lease_salesforce_from_domain.json') }

    it 'should convert from domain fields to Salesforce' do
      lease = Force::Lease.from_domain(lease_domain)
      salesforce_lease = lease.to_salesforce

      expect(salesforce_lease).to eq(lease_salesforce_from_domain)
    end
  end
end
