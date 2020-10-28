# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::PreferenceService do
  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing

  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::PreferenceService.new(user) }

  describe '#lease_up_preferences' do
    it 'should create the correct accessibility string for Mobility' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ listing_id: LEASE_UP_LISTING_ID, accessibility: 'Mobility impairments' })

        expect(filters).to include("INCLUDES ('Mobility impairments')")
      end
    end

    it 'should create the correct accessibility string Vision/Hearing' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ listing_id: LEASE_UP_LISTING_ID, accessibility: 'Vision impairments, Hearing impairments' })

        expect(filters).to include("INCLUDES ('Vision impairments', 'Hearing impairments')")
      end
    end

    it 'creates the expected query string when householdmembers is set to 1' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ total_household_size: '1' })

        expect(filters).to include("and Application__r.Total_Household_Size__c = 1")
      end
    end

    it 'creates the expected query string when householdmembers is set to 5+' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ total_household_size: '5+' })

        expect(filters).to include("and Application__r.Total_Household_Size__c >= 5")
      end
    end
  end
end
