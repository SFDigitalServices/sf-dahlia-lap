# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DahliaBackend::MessageService do
  let(:client) { instance_double(DahliaBackend::ApiClient) }
  let(:listing_id) { 'listing-123' }
  let(:application_id) { 'application-123' }
  let(:listing) do
    {
      id: listing_id,
      lottery_date: '2024-07-01T00:00:00Z',
      name: 'test listing',
      neighborhood: 'Castro/Upper Market',
      building_street_address: '1 South Van Ness Ave',
      file_upload_url: 'https://sf.gov',
      office_hours: 'Monday - Friday, 9am - 5pm',
      leasing_agent_name: 'Leasing Agent',
      leasing_agent_email: 'leasing@example.com',
      leasing_agent_phone: '555-555-5555',
      units: [
        {
          "Unit_Type": 'Studio',
          "BMR_Rent_Monthly": 1409.0,
          "BMR_Rental_Minimum_Monthly_Income_Needed": 2800,
          "Status": 'Available',
          "Property_Type": 'Apartment',
          "isReservedCommunity": false,
          "AMI_chart_type": 'MOHCD',
          "AMI_chart_year": 2025,
          "Max_AMI_for_Qualifying_Unit": 65,
        },
        {
          "Unit_Type": 'Studio',
          "BMR_Rent_Monthly": 2000.0,
          "BMR_Rental_Minimum_Monthly_Income_Needed": 2800,
          "Status": 'Available',
          "Property_Type": 'Apartment',
          "isReservedCommunity": false,
          "AMI_chart_type": 'MOHCD',
          "AMI_chart_year": 2025,
          "Max_AMI_for_Qualifying_Unit": 65,
        },
      ],
    }
  end
  let(:listing_details) do
    [{
      unitSummaries: {
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
      applicationIds: [application_id],
      listing: listing,
      invite_to_apply_deadline: '2024-07-01',
    }
  end
  let(:contacts) do
    {
      records: [{
        Id: application_id,
        applicationLanguage: 'English',
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

  let(:units) do
    [
      {
        unit_type: 'Studio',
        bmr_rent_monthly: 1409.0,
        bmr_rental_minimum_monthly_income_needed: 2800,
        status: 'Available',
        property_type: 'Apartment',
        ami_chart_type: 'MOHCD',
        ami_chart_year: 2025,
        max_ami_for_qualifying_unit: 65,
      },
      {
        unit_type: 'Studio',
        bmr_rent_monthly: 2000.0,
        bmr_rental_minimum_monthly_income_needed: 2800,
        status: 'Available',
        property_type: 'Apartment',
        ami_chart_type: 'MOHCD',
        ami_chart_year: 2025,
        max_ami_for_qualifying_unit: 65,
      },
    ]
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
      it 'returns nil if applicationIds are missing' do
        params_copy = invite_to_apply_params.dup
        params_copy.delete :applicationIds
        expect(subject.send_invite_to_apply(user, params_copy, contacts)).to be_nil
      end

      it 'returns nil if contacts are missing' do
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, [])).to be_nil
      end
    end

    context 'when units fetch fails' do
      it 'returns nil' do
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(nil)
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(nil)
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end

      it 'handles exceptions when fetching units' do
        allow(subject).to receive(:get_unit_summaries_from_rest_service).and_raise(StandardError.new('API error'))
        expect(Rails.logger).to receive(:error).with(
          '[DahliaBackend::MessageService:log_error] Error sending Invite to Apply: StandardError API error',
        )
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end
    end

    context 'with valid params' do
      before do
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(
          [{
            unitType: 'Studio',
            minRent: 1409.0,
            maxRent: 2000.0,
            availableUnits: 2,
          }],
        )
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(
          [{
            unitType: 'Studio',
            minRent: 1500,
            maxRent: 1600,
            availableUnits: 2,
          }],
        )
      end
      it 'sends a message and returns response' do
        expect(client).to receive(:post).with('/messages/invite-to-apply',
                                              hash_including(applicants:
                                                contain_exactly(hash_including(:primaryContact)))).and_return('ok')
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to eq('ok')
      end

      it 'uses REST unit summaries when listing units are empty' do
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(nil)
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(
          [{
            unitType: 'Studio',
            minRent: 1500,
            maxRent: 1600,
            availableUnits: 2,
          }],
        )

        expect(client).to receive(:post).with('/messages/invite-to-apply',
                                              hash_including(
                                                units: [{
                                                  unitType: 'Studio',
                                                  minRent: 1500,
                                                  maxRent: 1600,
                                                  availableUnits: 2,
                                                }],
                                              )).and_return('ok')

        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to eq('ok')
      end

      it 'returns nil when no unit summaries are available from any source' do
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(nil)
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(nil)
        expect(client).not_to receive(:post)
        expect(Rails.logger).to receive(:error).with(
          '[DahliaBackend::MessageService:log_error] Error sending Invite to Apply: RuntimeError No units found',
        )

        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end

      it 'returns nil and logs error if client.post fails' do
        expect(client).to receive(:post).and_return(nil)
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(units)
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(units)
        expect(Rails.logger).to receive(:error).with(start_with('[DahliaBackend::MessageService:log_error] Failed to send message to /messages/invite-to-apply:'))
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end

      it 'rescues and logs StandardError' do
        allow(client).to receive(:post).and_raise(StandardError.new('fail'))
        allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(units)
        allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(units)
        expect(Rails.logger).to receive(:error).with(start_with('[DahliaBackend::MessageService:log_error] Error sending Invite to Apply: StandardError fail'))
        expect(subject.send_invite_to_apply(user, invite_to_apply_params, contacts)).to be_nil
      end
    end
  end

  describe '#get_unit_summaries_from_listing' do
    subject(:service) { described_class.new(client) }

    before do
      service.instance_variable_set(:@current_user, user)
    end

    context 'when units are empty' do
      let(:listing_missing_units) do
        listing.except(:units)
      end

      it 'returns an empty array' do
        result = service.send(:get_unit_summaries_from_listing, listing_missing_units)

        expect(result).to eq([])
      end
    end

    context 'when units exist' do
      let(:units_payload) do
        [
          {
            status: 'Available',
            unit_type: '1 BR',
            bmr_rent_monthly: 1800,
          },
          {
            status: 'Available',
            unit_type: '1 BR',
            bmr_rent_monthly: 2200,
          },
          {
            status: 'Occupied',
            unit_type: '1 BR',
            bmr_rent_monthly: 9999,
          },
          {
            status: 'Available',
            unit_type: '2 BR',
            bmr_rent_monthly: 2600,
          },
        ]
      end

      let(:listing_with_units_payload) do
        listing.merge(units: units_payload)
      end

      let(:summary) do
        [{
          unitType: '1 BR',
          minRent: 1800,
          maxRent: 2200,
          availableUnits: 2,
        },
         {
           unitType: '2 BR',
           minRent: 2600,
           maxRent: 2600,
           availableUnits: 1,
         }]
      end

      it 'derives min/max BMR and available count per unit type from available units only' do
        result = service.send(:get_unit_summaries_from_listing, listing_with_units_payload)

        expect(result).to eq(
          [{
            unitType: '1 BR',
            minRent: 1800,
            maxRent: 2200,
            availableUnits: 2,
          },
           {
             unitType: '2 BR',
             minRent: 2600,
             maxRent: 2600,
             availableUnits: 1,
           }],
        )
      end

      it 'returns empty summaries when units use string keys' do
        result = service.send(:get_unit_summaries_from_listing, listing)

        expect(result).to eq([])
      end
    end
  end

  describe '#prepare_units' do
    subject(:service) { described_class.new(client) }

    before do
      service.instance_variable_set(:@current_user, user)
    end

    it 'pulls unit summaries from REST when listing units are empty' do
      allow(service).to receive(:get_unit_summaries_from_listing).with(listing).and_return([])
      allow(service).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(
        [{
          unitType: 'Studio',
          minRent: 1375.0,
          maxRent: 2224.0,
          availableUnits: 16.0,
        }, {
          unitType: '1 BR',
          minRent: 1553.0,
          maxRent: 2736.0,
          availableUnits: 26.0,
        }],
      )

      result = service.send(:prepare_units, listing_id, listing)

      expect(result).to eq(
        [{
          unitType: 'Studio',
          minRent: 1375.0,
          maxRent: 2224.0,
          availableUnits: 16.0,
        }, {
          unitType: '1 BR',
          minRent: 1553.0,
          maxRent: 2736.0,
          availableUnits: 26.0,
        }],
      )
    end

    it 'uses listing summaries first and skips REST lookup when listing summaries are present' do
      allow(service).to receive(:get_unit_summaries_from_listing).with(listing).and_return(
        [{
          unitType: 'Studio',
          minRent: 1409.0,
          maxRent: 2000.0,
          availableUnits: 2,
        }],
      )
      expect(service).not_to receive(:get_unit_summaries_from_rest_service)

      result = service.send(:prepare_units, listing_id, listing)

      expect(result).to eq(
        [{
          unitType: 'Studio',
          minRent: 1409.0,
          maxRent: 2000.0,
          availableUnits: 2,
        }],
      )
    end
  end

  describe '#get_unit_summaries_from_rest_service' do
    subject(:service) { described_class.new(client) }

    before do
      service.instance_variable_set(:@current_user, user)
    end

    it 'maps general unit summaries from REST payload' do
      allow(listing_service).to receive(:get_details).with(listing_id).and_return(
        [{
          unitSummaries: {
            general: [{
              unitType: 'Studio',
              minMonthlyRent: 1375.0,
              maxMonthlyRent: 2224.0,
              availability: 16.0,
            }],
            reserved: [{
              unitType: '1 BR',
              minMonthlyRent: 1553.0,
              maxMonthlyRent: 2736.0,
              availability: 26.0,
            }],
          },
        }],
      )

      result = service.send(:get_unit_summaries_from_rest_service, listing_id)

      expect(result).to eq(
        [{
          unitType: 'Studio',
          minRent: 1375.0,
          maxRent: 2224.0,
          availableUnits: 16.0,
        }],
      )
    end

    it 'falls back to reserved summaries when general summaries are blank' do
      allow(listing_service).to receive(:get_details).with(listing_id).and_return(
        [{
          unitSummaries: {
            general: [],
            reserved: [{
              unitType: '1 BR',
              minMonthlyRent: 1553.0,
              maxMonthlyRent: 2736.0,
              availability: 26.0,
            }],
          },
        }],
      )

      result = service.send(:get_unit_summaries_from_rest_service, listing_id)

      expect(result).to eq(
        [{
          unitType: '1 BR',
          minRent: 1553.0,
          maxRent: 2736.0,
          availableUnits: 26.0,
        }],
      )
    end

    it 'returns an empty array when REST unit summaries are missing' do
      allow(listing_service).to receive(:get_details).with(listing_id).and_return(
        [{ unitSummaries: nil }],
      )

      result = service.send(:get_unit_summaries_from_rest_service, listing_id)

      expect(result).to eq([])
    end
  end
end
