# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::ApplicationService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  let(:client) { instance_double('Restforce::Data::Client') }
  let(:api) { instance_double(Force::Api) }
  let(:client_factory) { instance_double(Force::ClientFactory, build: client) }
  let(:application_id) { 'application-1' }
  let(:created_date_descending) { 'CreatedDate DESC' }
  subject(:service) { described_class.new(user) }

  before do
    allow(Force::ClientFactory).to receive(:new).with(user).and_return(client_factory)
    allow(Force::Api).to receive(:new).with(client).and_return(api)
  end

  describe '#applications' do
    it 'applies default ordering and executes query when no optional filters are present' do
      query_scope = instance_double(Force::SoqlQueryBuilder)

      allow(service).to receive(:applications_query).and_return(query_scope)
      allow(query_scope).to receive(:order_by).and_return(query_scope)
      allow(query_scope).to receive(:query).and_return(:results)

      expect(query_scope).to receive(:order_by).with(created_date_descending)
      expect(query_scope).to receive(:query)

      expect(service.applications({})).to eq(:results)
    end

    it 'applies all filters and executes query' do
      query_scope = instance_double(Force::SoqlQueryBuilder)

      allow(service).to receive(:applications_query).and_return(query_scope)
      allow(query_scope).to receive(:order_by).and_return(query_scope)
      allow(query_scope).to receive(:where_contains).and_return(query_scope)
      allow(query_scope).to receive(:where_eq).and_return(query_scope)
      allow(query_scope).to receive(:where).and_return(query_scope)
      allow(query_scope).to receive(:query).and_return(:results)

      expect(query_scope).to receive(:order_by).with(created_date_descending)
      expect(query_scope).to receive(:where_contains).with(:Name, 'APP-1')
      expect(query_scope).to receive(:where_eq).with('Listing__r.Id', "'listing-1'")
      expect(query_scope).to receive(:where_eq).with('Applicant__r.First_Name__c', "'Alice'")
      expect(query_scope).to receive(:where_eq).with('Applicant__r.Last_Name__c', "'Smith'")
      expect(query_scope).to receive(:where_eq).with('Application_Submission_Type__c', "'Paper'")
      expect(query_scope).to receive(:where_eq).with('Processing_Status__c', "'Approved'")
      expect(query_scope).to receive(:where_eq).with('General_Lottery__c', 'true')
      expect(query_scope).to receive(:where).with('General_Lottery_Rank__c != NULL')
      expect(query_scope).to receive(:order_by).with('General_Lottery_Rank__c')
      expect(query_scope).to receive(:query)

      result = service.applications(
        {
          application_number: 'APP-1',
          listing_id: 'listing-1',
          first_name: 'Alice',
          last_name: 'Smith',
          submission_type: 'Paper',
          status: 'Approved',
          preference: 'general',
        },
      )

      expect(result).to eq(:results)
    end

    it 'uses NULL status filter when status is No Status' do
      query_scope = instance_double(Force::SoqlQueryBuilder)

      allow(service).to receive(:applications_query).and_return(query_scope)
      allow(query_scope).to receive(:order_by).and_return(query_scope)
      allow(query_scope).to receive(:where_eq).and_return(query_scope)
      allow(query_scope).to receive(:query).and_return(:results)

      expect(query_scope).to receive(:where_eq).with('Processing_Status__c', 'NULL')

      service.applications({ status: 'No Status' })
    end
  end

  describe '#application' do
    let(:applicant) { Hashie::Mash.new(id: 'applicant-1') }
    let(:alternate_contact) { Hashie::Mash.new(id: 'alt-1') }
    let(:application_domain) do
      Hashie::Mash.new(
        id: application_id,
        applicant: applicant,
        alternate_contact: alternate_contact,
      )
    end

    it 'hydrates associations and includes lease/rental assistance by default' do
      listing = Hashie::Mash.new(Listing_Type: 'lease_up')
      converted = double('converted_application', to_domain: application_domain)
      preference_service = instance_double(Force::Soql::PreferenceService)
      attachment_service = instance_double(Force::Soql::AttachmentService)
      lease_service = instance_double(Force::Soql::LeaseService)
      rental_assistance_service = instance_double(Force::Soql::RentalAssistanceService)

      allow(service).to receive(:query_first).and_return('raw_app')
      allow(Force::Application).to receive(:from_salesforce).with('raw_app').and_return(converted)
      allow(service).to receive(:application_listing).with(application_id).and_return(listing)
      allow(service).to receive(:soql_preference_service).and_return(preference_service)
      allow(service).to receive(:soql_attachment_service).and_return(attachment_service)
      allow(service).to receive(:soql_lease_service).and_return(lease_service)
      allow(service).to receive(:soql_rental_assistance_service).and_return(rental_assistance_service)
      allow(service).to receive(:app_household_members).and_return([{ id: 'hm-1' }])

      allow(preference_service).to receive(:app_preferences_for_application).and_return([{ id: 'pref-1' }])
      allow(attachment_service).to receive(:app_proof_files).and_return([{ id: 'proof-1' }])
      allow(lease_service).to receive(:application_lease).and_return({ id: 'lease-1' })
      allow(rental_assistance_service).to receive(:application_rental_assistances).and_return([{ id: 'ra-1' }])

      result = service.application(application_id)

      expect(preference_service).to have_received(:app_preferences_for_application)
        .with(application_id, should_order: true)
      expect(service).to have_received(:app_household_members).with(application_id, 'applicant-1', 'alt-1')
      expect(result['preferences']).to eq([{ 'id' => 'pref-1' }])
      expect(result['proof_files']).to eq([{ 'id' => 'proof-1' }])
      expect(result['household_members']).to eq([{ 'id' => 'hm-1' }])
      expect(result['lease']).to eq({ 'id' => 'lease-1' })
      expect(result['rental_assistances']).to eq([{ 'id' => 'ra-1' }])
    end

    it 'skips preferences for first-come-first-served listings and optional includes' do
      fcfs_listing = Hashie::Mash.new(Listing_Type: Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED)
      converted = double('converted_application', to_domain: application_domain)
      preference_service = instance_double(Force::Soql::PreferenceService)
      attachment_service = instance_double(Force::Soql::AttachmentService)

      allow(service).to receive(:query_first).and_return('raw_app')
      allow(Force::Application).to receive(:from_salesforce).with('raw_app').and_return(converted)
      allow(service).to receive(:application_listing).with(application_id).and_return(fcfs_listing)
      allow(service).to receive(:soql_preference_service).and_return(preference_service)
      allow(preference_service).to receive(:app_preferences_for_application)
      allow(service).to receive(:soql_attachment_service).and_return(attachment_service)
      allow(service).to receive(:app_household_members).and_return([])
      allow(attachment_service).to receive(:app_proof_files).and_return([])

      result = service.application(application_id, include_lease: false, include_rental_assistances: false)

      expect(preference_service).not_to have_received(:app_preferences_for_application)
      expect(result['preferences']).to be_nil
      expect(result).not_to have_key('lease')
      expect(result).not_to have_key('rental_assistances')
    end
  end

  describe '#application_listing' do
    it 'returns Listing when query result contains one' do
      listing = Hashie::Mash.new(Id: 'listing-1')

      allow(service).to receive(:query_first).and_return('raw_listing')
      allow(service).to receive(:massage).with('raw_listing').and_return(Hashie::Mash.new(Listing: listing))

      expect(service.application_listing(application_id)).to eq(listing)
    end

    it 'returns nil when query result is blank' do
      allow(service).to receive(:query_first).and_return(nil)
      allow(service).to receive(:massage).with(nil).and_return(nil)

      expect(service.application_listing(application_id)).to be_nil
    end
  end

  describe '#application_contacts' do
    let(:query_scope) { instance_double(Force::SoqlQueryBuilder) }
    let(:massaged_results) { [{ id: 'app-1' }] }

    before do
      allow(service).to receive(:builder).and_return(query_scope)
      allow(query_scope).to receive(:from).with(:Application__c).and_return(query_scope)
      allow(query_scope).to receive(:select).with(service.send(:query_fields, :show_contacts)).and_return(query_scope)
      allow(query_scope).to receive(:where)
        .with("Status__c != '#{described_class::DRAFT}' AND Application_Submitted_Date__c != NULL")
        .and_return(query_scope)
      allow(query_scope).to receive(:paginate).and_return(query_scope)
      allow(query_scope).to receive(:transform_results).and_return(query_scope)
      allow(query_scope).to receive(:order_by).with(created_date_descending).and_return(query_scope)
      allow(query_scope).to receive(:query).and_return(massaged_results)
      allow(query_scope).to receive(:where_in).and_return(query_scope)
      allow(service).to receive(:massage).and_return(massaged_results)
    end

    it 'applies where_in when applicationIds are provided' do
      options = { applicationIds: %w[a1 a2], page: 0 }

      expect(query_scope).to receive(:where_in).with('Id', %w[a1 a2])
      expect(query_scope).to receive(:query)

      expect(service.application_contacts(options)).to eq(massaged_results)
    end

    it 'does not apply where_in when applicationIds are not provided' do
      expect(query_scope).not_to receive(:where_in)
      expect(query_scope).to receive(:query)

      expect(service.application_contacts({ page: 0 })).to eq(massaged_results)
    end
  end

  describe '#application_defaults' do
    it 'returns expected default attributes' do
      defaults = service.send(:application_defaults)

      expect(defaults[:applicationSubmissionType]).to eq('Paper')
      expect(defaults[:status]).to eq('Submitted')
      expect(defaults[:applicationSubmittedDate]).to match(/\A\d{4}-\d{2}-\d{2}\z/)
    end
  end
end
