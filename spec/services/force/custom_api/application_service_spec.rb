# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::CustomApi::ApplicationService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  let(:client) { instance_double('Restforce::Data::Client') }
  let(:api) { instance_double(Force::Api) }
  let(:client_factory) { instance_double(Force::ClientFactory, build: client) }

  subject(:service) { described_class.new(user) }

  before do
    allow(Force::ClientFactory).to receive(:new).with(user).and_return(client_factory)
    allow(Force::Api).to receive(:new).with(client).and_return(api)
  end

  describe '#application' do
    let(:application_id) { 'app-1' }
    let(:contact_id) { 'contact-1' }
    let(:custom_api_application_fields) { Hashie::Mash.new('id' => application_id) }
    let(:application) { Hashie::Mash.new(applicant: Hashie::Mash.new(contact_id: contact_id)) }
    let(:converted_application) { instance_double('ConvertedApplication', to_domain: application) }
    let(:contact_fields) { { 'email' => 'primary@example.com' } }
    let(:contact_domain) { Hashie::Mash.new(email: 'primary@example.com') }
    let(:contact_model) { instance_double(Force::Contact, to_domain: contact_domain) }
    let(:rest_person_service) { instance_double(Force::Rest::PersonService) }
    let(:preference_service) { instance_double(Force::Soql::PreferenceService) }

    before do
      allow(service).to receive(:api_get)
        .with("/shortForm/#{application_id}")
        .and_return(custom_api_application_fields)
      allow(Force::Application).to receive(:from_custom_api)
        .with(custom_api_application_fields)
        .and_return(converted_application)
      allow(service).to receive(:add_application_members)
        .with(application, custom_api_application_fields)
        .and_return(application)
      allow(service).to receive(:rest_person_service).and_return(rest_person_service)
      allow(rest_person_service).to receive(:get_details).with(contact_id).and_return(contact_fields)
      allow(Force::Contact).to receive(:from_custom_api).with(contact_fields).and_return(contact_model)
      allow(service).to receive(:soql_preference_service).and_return(preference_service)
      allow(preference_service).to receive(:app_preferences_for_application).with(application_id).and_return([])
    end

    it 'adds contact_info from Rest person details' do
      result = service.application(application_id)

      expect(rest_person_service).to have_received(:get_details).with(contact_id)
      expect(Force::Contact).to have_received(:from_custom_api).with(contact_fields)
      expect(result.contact_info).to eq(contact_domain)
    end

    it 'returns nil when custom API application is not found' do
      allow(service).to receive(:api_get)
        .with("/shortForm/#{application_id}")
        .and_raise(Faraday::ResourceNotFound.new('not found'))

      expect(service.application(application_id)).to be_nil
    end
  end

  describe '#add_contact_info' do
    let(:contact_id) { 'contact-2' }
    let(:phone) { '4155551212' }
    let(:application) { Hashie::Mash.new(applicant: Hashie::Mash.new(contact_id: contact_id)) }
    let(:contact_fields) { { 'phone' => phone } }
    let(:contact_domain) { Hashie::Mash.new(phone: phone) }
    let(:contact_model) { instance_double(Force::Contact, to_domain: contact_domain) }
    let(:rest_person_service) { instance_double(Force::Rest::PersonService) }

    before do
      allow(service).to receive(:rest_person_service).and_return(rest_person_service)
      allow(rest_person_service).to receive(:get_details).with(contact_id).and_return(contact_fields)
      allow(Force::Contact).to receive(:from_custom_api).with(contact_fields).and_return(contact_model)
    end

    it 'hydrates and assigns contact_info on the application' do
      result = service.send(:add_contact_info, application)

      expect(rest_person_service).to have_received(:get_details).with(contact_id)
      expect(Force::Contact).to have_received(:from_custom_api).with(contact_fields)
      expect(result.contact_info).to eq(contact_domain)
    end
  end
end
