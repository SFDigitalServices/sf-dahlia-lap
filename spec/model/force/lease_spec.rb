# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Lease do
  describe '#to_salesforce' do
    let(:lease_domain_fixture) { fixture('model/force/lease/lease_domain.json') }
    let(:incoming_lease_domain_fixture) do
      lease = fixture('model/force/lease/lease_domain.json')
      # incoming date is in the array format, while outgoing is mapped to json
      lease['lease_start_date'] = %w[2028 01 01]

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
      lease = Force::Lease.from_domain('lease_start_date': ['', '', ''])
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

      expect(domain_lease['monthly_parking_rent']).to eq('$1,000.00')
    end
  end

  describe '#date_to_domain' do
    it 'should convert string dates to array' do
      salesforce_date = '2019-01-22'
      domain_date = Force::Lease.date_to_domain(salesforce_date)
      expected = %w[2019 01 22]
      expect(domain_date).to eq(expected)
    end

    it 'should return nil for empty or nil salesforce_date' do
      expect(Force::Lease.date_to_domain('')).to eq(nil)
      expect(Force::Lease.date_to_domain(nil)).to eq(nil)
    end
  end

  describe '#date_to_salesforce' do
    it 'should convert array of values to string date' do
      domain_date = %w[2019 1 2]
      salesforce_date = Force::Lease.date_to_salesforce(domain_date)
      expected = '2019-01-02'
      expect(salesforce_date).to eq(expected)
    end

    it 'should return nil for empty domain date' do
      expect(Force::Lease.date_to_salesforce(nil)).to eq(nil)
      expect(Force::Lease.date_to_salesforce([])).to eq(nil)
      expect(Force::Lease.date_to_salesforce(['', '', ''])).to eq(nil)
    end
  end
end
