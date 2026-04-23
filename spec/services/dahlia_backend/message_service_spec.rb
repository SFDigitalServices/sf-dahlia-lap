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
    double(
      'User',
      id: 1,
      email: 'admin@example.com',
      provider: nil,
      uid: nil,
      salesforce_user_id: nil,
      oauth: nil,
      admin: true,
    )
  end
  let(:invite_params) do
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
        Application_Language: 'English',
        Lottery_Number: '12345',
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
  let(:i2iFlag) { 'all.i2i' }
  let(:listing_service) { instance_double(Force::Rest::ListingService) }
  let(:application_service) { instance_double(Force::Soql::ApplicationService) }

  before do
    allow(Force::Rest::ListingService).to receive(:new).and_return(listing_service)
    allow(listing_service).to receive(:get_details).with(listing_id).and_return(listing_details)
  end

  describe '.send_invite' do
    it 'delegates to instance method' do
      expect_any_instance_of(described_class).to receive(:send_invite)
        .with(user, invite_params)
      described_class.send_invite(user, invite_params)
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

  describe '#send_invite' do
    subject { described_class.new(client) }

    before do
      allow(Rails.configuration.unleash).to receive(:is_enabled?).with(i2iFlag).and_return(true)
    end

    context 'with invalid params' do
      it 'returns nil if applicationIds are missing' do
        params_copy = invite_params.dup
        params_copy.delete :applicationIds
        expect(subject.send_invite(user, params_copy)).to be_nil
      end
    end

    context 'with valid params when i2i feature is enabled' do
      before do
        allow(Rails.configuration.unleash).to receive(:is_enabled?).with(i2iFlag).and_return(true)
      end

      it 'sends a message and returns response' do
        expect(client).to receive(:post).with('/api/v1/message',
                                              hash_including(
                                                data: hash_including(
                                                  applicationIds: invite_params[:applicationIds],
                                                ),
                                              )).and_return('ok')
        expect(subject.send_invite(user, invite_params)).to eq('ok')
      end

      it 'returns nil and logs error if client.post fails' do
        expect(client).to receive(:post).and_return(nil)
        expect(Rails.logger).to receive(:error).with(
          start_with(
            '[DahliaBackend::MessageService:log_error] Failed to send message to /api/v1/message:',
          ),
        )
        expect(subject.send_invite(user, invite_params)).to be_nil
      end

      it 'rescues and logs StandardError' do
        allow(client).to receive(:post).and_raise(StandardError.new('fail'))
        expect(Rails.logger).to receive(:error).with(
          start_with(
            '[DahliaBackend::MessageService:log_error] Error send_invite: StandardError fail',
          ),
        )
        expect(subject.send_invite(user, invite_params)).to be_nil
      end
    end

    context 'when i2i feature is disabled' do
      before do
        allow(Rails.configuration.unleash).to receive(:is_enabled?).with(i2iFlag).and_return(false)
        allow(subject).to receive(:soql_application_service).and_return(application_service)
      end

      context 'when units fetch fails' do
        it 'returns nil' do
          allow(application_service).to receive(:application_contacts).with(invite_params).and_return(contacts)
          allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(nil)
          allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id).and_return(nil)

          expect(subject.send_invite(user, invite_params)).to be_nil
        end

        it 'handles exceptions when fetching units' do
          allow(application_service).to receive(:application_contacts).with(invite_params).and_return(contacts)
          allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(nil)
          allow(subject).to receive(:get_unit_summaries_from_rest_service).with(listing_id)
                                                                          .and_raise(StandardError.new('API error'))

          expect(Rails.logger).to receive(:error).with(
            start_with('[DahliaBackend::MessageService:log_error] Error send_invite: StandardError API error'),
          )

          expect(subject.send_invite(user, invite_params)).to be_nil
        end
      end

      context 'with valid params' do
        let(:prepared_units) do
          [{
            unitType: 'Studio',
            minRent: 1409,
            maxRent: 2000,
            availableUnits: 2,
          }]
        end

        before do
          allow(application_service).to receive(:application_contacts).with(invite_params).and_return(contacts)
          allow(subject).to receive(:get_unit_summaries_from_listing).with(listing).and_return(prepared_units)
        end

        it 'sends payload with listing and applicant details' do
          expect(client).to receive(:post).with(
            '/api/v1/message',
            hash_including(
              data: hash_including(
                isTestEmail: false,
                payload: hash_including(
                  listingId: listing_id,
                  units: prepared_units,
                  applicants: [
                    hash_including(
                      applicationNumber: application_id,
                      applicationLanguage: 'English',
                      lotteryNumber: '12345',
                    ),
                  ],
                ),
              ),
            ),
          ).and_return('ok')

          expect(subject.send_invite(user, invite_params)).to eq('ok')
        end
      end
    end
  end
end
