# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Rest::PersonService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  let(:client) { instance_double('Restforce::Data::Client') }
  let(:api) { instance_double(Force::Api) }
  let(:client_factory) { instance_double(Force::ClientFactory, build: client) }

  subject(:service) { described_class.new(user) }

  before do
    allow(Force::ClientFactory).to receive(:new).with(user).and_return(client_factory)
    allow(Force::Api).to receive(:new).with(client).and_return(api)
  end

  describe '#get_details' do
    it 'returns nil and logs an error when the API request fails' do
      allow(service).to receive(:api_get).with('/Person/003123').and_raise(StandardError.new('boom'))
      expect(Rails.logger).to receive(:error).with('Error fetching person details: boom')

      result = service.get_details('003123')

      expect(result).to be_nil
    end
  end
end