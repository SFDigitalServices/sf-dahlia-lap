# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DahliaBackend::MessageService do
  let(:client) { instance_double(DahliaBackend::ApiClient) }
  let(:listing_id) { 'listing-123' }
  let(:listing) do
    {
      id: listing_id,
      lottery_date: '2024-07-01T00:00:00Z',
      name: 'test listing',
      neighborhood: 'Castro/Upper Market',
      building_street_address: '1 South Van Ness Ave',
      file_upload_url: 'https://sf.gov',
    }
  end
  let(:listing_details) do
    [{
      unit_summaries: {
        reserved: nil,
        general: [{
          unitType: 'Studio',
          minMonthlyRent: 1375.0,
          maxMonthlyRent: 2224.0,
          availability: 16.0,
        }, {
          unitType: '1 BR',
          minMonthlyRent: 1553.0,
          maxMonthlyRent: 2736.0,
          availability: 26.0,
        }],
      },
    }]
  end
  let(:user) do
    double('User', id: 1, email: 'admin@example.com', provider: nil, uid: nil, salesforce_user_id: nil, oauth: nil, admin: true)
  end
  let(:invite_to_apply_params) do
    {
      ids: [listing_id],
      listing: listing,
      invite_to_apply_deadline: '2024-07-01',
    }
  end
  let(:contacts) do
    {
      records: [{
        Id: listing_id,
        Applicant: {
          First_Name: 'John',
          Last_Name: 'Doe',
          Email: 'test@example.com',
        },
        Alternate_Contact: {
          First_Name: 'Jane',
          Last_Name: 'Doe',
          Email: 'test@example.com',
        },
      }],
    }
  end
  let(:listing_service) { instance_double(Force::Rest::ListingService) }

  before do
    allow(Force::Rest::ListingService).to receive(:new).and_return(listing_service)
    allow(listing_service).to receive(:get_details).with(listing_id).and_return(listing_details)
  end

  describe '.send_invite_to_apply' do
    it 'delegates to instance method' do
      expect_any_instance_of(described_class).to receive(:send_invite_to_apply)
        .with(user, invite_to_apply_params, contacts)
      described_class.send_invite_to_apply(user, invite_to_apply_params, contacts)
    end
  end

  describe '#initialize' do
    it 'uses provided client' do
      service = described_class.new(client)
      expect(service.client).to eq(client)
    end

    it 'creates a new client when none provided' do
      expect(DahliaBackend::ApiClient).to receive(:new).and_return(client)
      service = described_class.new
      expect(service.client).to eq(client)
    end
  end

  describe '#send_invite_to_apply' do
    subject { described_class.new(client) }

    context 'with invalid params' do
      it 'returns nil if ids are missing' do
        params_copy = invite_to_apply_params.dup
        params_copy.delete :ids
        expect(subject.send_invite_to_apply(user, params_copy, contacts)).to be_nil
      end

      it 'returns nil if contacts are missing' do
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, [])).to be_nil
      end
    end

    context 'when listing detail fetch fails' do
      it 'returns nil' do
        allow(listing_service).to receive(:get_details).with(listing_id).and_return(nil)
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end

      it 'handles exceptions when fetching listing' do
        allow(listing_service).to receive(:get_details).and_raise(StandardError.new('API error'))
        expect(Rails.logger).to receive(:error).with(
          '[DahliaBackend::MessageService:log_error] Error sending Invite to Apply: StandardError API error',
        )
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end
    end

    context 'with valid params' do
      it 'sends a message and returns response' do
        expect(client).to receive(:post).with('/messages/invite-to-apply',
                                              hash_including(applicants:
                                                contain_exactly(hash_including(:primaryContact)))).and_return('ok')
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to eq('ok')
      end

      it 'returns nil and logs error if client.post fails' do
        expect(client).to receive(:post).and_return(nil)
        expect(Rails.logger).to receive(:error).with(/Failed to send message/)
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end

      it 'rescues and logs StandardError' do
        allow(client).to receive(:post).and_raise(StandardError.new('fail'))
        expect(Rails.logger).to receive(:error).with(
          '[DahliaBackend::MessageService:log_error] Error sending Invite to Apply: StandardError fail',
        )
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end
    end
  end
end
