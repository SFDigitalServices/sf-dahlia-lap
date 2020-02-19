# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Lease do
  describe '#to_salesforce' do
    let(:lease_domain_fixture) { fixture('model/force/lease/lease_domain.json') }
    let(:incoming_lease_domain_fixture) do
      lease = fixture('model/force/lease/lease_domain.json')

      # incoming currencies are number, while outgoing are strings
      lease['monthly_parking_rent'] = 1000
      lease['monthly_tenant_contribution'] = 1800
      lease['total_monthly_rent_without_parking'] = 1000
      lease
    end
    let(:lease_domain_to_salesforce) { fixture('model/force/lease/lease_domain_to_salesforce.json') }

    it 'should convert from domain fields to Salesforce' do
      lease = Force::Lease.from_domain(incoming_lease_domain_fixture)
      salesforce_lease = lease.to_salesforce

      expect(salesforce_lease).to eq(lease_domain_to_salesforce)
    end

    it 'should convert empty lease start date to Salesforce' do
      lease = Force::Lease.from_domain('lease_start_date': {})
      salesforce_lease = lease.to_salesforce

      expect(salesforce_lease['Lease_Start_Date__C']).to eq(nil)
    end

    it 'should handle an empty lease object' do
      lease = Force::Lease.from_domain({})
      salesforce_lease = lease.to_salesforce
      expect(salesforce_lease).to eq({})
    end
  end

  describe '#to_domain' do
    let(:lease_domain_fixture) { fixture('model/force/lease/lease_domain.json') }
    let(:lease_salesforce_soql) { fixture('model/force/lease/lease_salesforce_soql.json') }

    it 'should convert from Salesforce fields to domain' do
      lease = Force::Lease.from_salesforce(lease_salesforce_soql)
      domain_lease = lease.to_domain

      expect(domain_lease).to eq(lease_domain_fixture)
    end

    it 'should convert empty lease start date to domain' do
      lease = Force::Lease.from_salesforce('Lease_Start_Date': nil)
      domain_lease = lease.to_domain

      expect(domain_lease['lease_start_date']).to eq(nil)
    end

    it 'should handle an empty lease object' do
      lease = Force::Lease.from_salesforce({})
      domain_lease = lease.to_domain

      expect(domain_lease).to eq({})
    end

    it 'should convert float to currency' do
      lease = Force::Lease.from_salesforce(lease_salesforce_soql)
      domain_lease = lease.to_domain

      expect(domain_lease['monthly_parking_rent']).to eq(1000)
    end
  end
end
