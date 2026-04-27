# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Rest::ListingService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  let(:client) { instance_double('Restforce::Data::Client') }
  let(:api) { instance_double(Force::Api) }
  let(:client_factory) { instance_double(Force::ClientFactory, build: client) }

  subject(:service) { described_class.new(user) }

  before do
    allow(Force::ClientFactory).to receive(:new).with(user).and_return(client_factory)
    allow(Force::Api).to receive(:new).with(client).and_return(api)
  end

  describe '#update' do
    it 'converts domain attrs to salesforce payload and updates listing record' do
      domain_attrs = { id: 'listing-1', name: 'Listing Name' }
      listing = instance_double(Force::Listing)
      salesforce_payload = { Name: 'Listing Name' }

      allow(Force::Listing).to receive(:from_domain).with(domain_attrs).and_return(listing)
      allow(listing).to receive(:to_salesforce).and_return(salesforce_payload)

      expect(client).to receive(:update!).with('Listing__c', salesforce_payload)

      service.update(domain_attrs)
    end
  end

  describe '#get_details' do
    it 'fetches listing details from the REST endpoint' do
      listing_id = 'a0W123'

      expect(service).to receive(:api_get).with('/ListingDetails/a0W123').and_return({ id: listing_id })

      result = service.get_details(listing_id)

      expect(result).to eq({ id: listing_id })
    end
  end
end
