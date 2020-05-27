# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Listing do
  let(:mock_listing_domain) { fixture('model/force/listing/listing_domain.json') }
  let(:mock_listing_salesforce) { fixture('model/force/listing/listing_salesforce.json') }

  describe '#to_domain' do
    it 'should convert from Salesforce fields to domain' do
      domain_listing = Force::Listing.from_salesforce(mock_listing_salesforce).to_domain
      expect(domain_listing[:units]).to eq(mock_listing_domain['units'])
      expect(domain_listing[:open_houses]).to eq(mock_listing_domain['open_houses'])
      expect(domain_listing[:listing_lottery_preferences]).to eq(mock_listing_domain['listing_lottery_preferences'])
      expect(domain_listing).to eq(mock_listing_domain)
    end
  end

  describe '#to_salesforce' do
    it 'should convert from Salesforce fields to domain' do
      salesforce_listing = Force::Listing.from_domain(mock_listing_domain).to_salesforce
      expect(salesforce_listing[:Units]).to eq(mock_listing_salesforce['Units'])
      expect(salesforce_listing[:Open_Houses]).to eq(mock_listing_salesforce['Open_Houses'])
      expect(salesforce_listing[:Listing_Lottery_Preferences]).to eq(mock_listing_salesforce['Listing_Lottery_Preferences'])
      expect(salesforce_listing).to eq(mock_listing_salesforce)
    end
  end
end
