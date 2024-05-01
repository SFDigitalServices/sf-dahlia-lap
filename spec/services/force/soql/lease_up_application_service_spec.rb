# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::LeaseUpApplicationService do
  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing

  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::LeaseUpApplicationService.new(user) }

  describe 'build_applications_filters' do
    it 'should create the correct accessibility string for Mobility' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ listing_id: LEASE_UP_LISTING_ID, accessibility: ['Mobility impairments'] })

        expect(filters).to include("INCLUDES ('Mobility impairments')")
      end
    end

    it 'should create the correct accessibility string Vision/Hearing' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ listing_id: LEASE_UP_LISTING_ID, accessibility: ['Vision impairments',
                                                                                                        'Hearing impairments'] })

        expect(filters).to include("INCLUDES ('Vision impairments', 'Hearing impairments')")
      end
    end

    it 'creates the expected query string when householdmembers is set to 1' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ total_household_size: ['1'] })

        expect(filters).to include('and (Total_Household_Size__c = 1)')
      end
    end

    it 'creates the expected query string when householdmembers is set to 5+' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ total_household_size: ['5+'] })

        expect(filters).to include('and (Total_Household_Size__c >= 5)')
      end
    end

    it 'creates the expected query string when householdmembers has two values' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ total_household_size: ['1', '5+'] })

        expect(filters).to include('and (Total_Household_Size__c = 1 or Total_Household_Size__c >= 5)')
      end
    end

    it 'creates the expected query string when status has two values' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ status: ['No Status', 'Processing'] })

        expect(filters).to include('and (Processing_Status__c = NULL or'\
                                   ' Processing_Status__c = \'Processing\')')
      end
    end

    it 'creates the expected query string when status is null and household is not' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_filters({ status: ['No Status'], total_household_size: ['1'] })

        expect(filters).to include('and (Processing_Status__c = NULL) '\
                                   'and (Total_Household_Size__c = 1)')
      end
    end
  end

  describe 'build_applications_search' do
    it 'creates the expected query string for a single search term' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_search('searchString')
        expected_filters = [
          '(',
          "Name like '%searchString%' OR ",
          "Applicant__r.First_Name__c like '%searchString%' OR ",
          "Applicant__r.Last_Name__c like '%searchString%'",
          ')',
        ].join('')
        expect(filters).to eq(expected_filters)
      end
    end
    it 'creates the expected query string for multiple search terms' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_search('string1,string2')
        expected_filters = [
          '(',
          "Name like '%string1%' OR ",
          "Applicant__r.First_Name__c like '%string1%' OR ",
          "Applicant__r.Last_Name__c like '%string1%'",
          ') AND (',
          "Name like '%string2%' OR ",
          "Applicant__r.First_Name__c like '%string2%' OR ",
          "Applicant__r.Last_Name__c like '%string2%'",
          ')',
        ].join('')
        expect(filters).to eq(expected_filters)
      end
    end
    it 'sanitizes search terms' do
      VCR.use_cassette('services/soql/lease_up_application_service') do
        filters = subject.build_applications_search('%"_something')
        expected_filters = [
          '(',
          "Name like '%\\%\"\\_something%' OR ",
          "Applicant__r.First_Name__c like '%\\%\"\\_something%' OR ",
          "Applicant__r.Last_Name__c like '%\\%\"\\_something%'",
          ')',
        ].join('')
        expect(filters).to eq(expected_filters)
      end
    end
  end
end
