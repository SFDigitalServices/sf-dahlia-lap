# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::FlaggedApplication do
  let(:mock_domain) do
    {
      'id' => 'testid',
      'review_status' => 'test review status',
      'comments' => 'test comment'
    }
  end
  let(:mock_salesforce) do
    {
      'Id' => 'testid',
      'Review_Status' => 'test review status',
      'Comments' => 'test comment'
    }
  end
  let(:mock_salesforce_with_suffix) do
    {
      'Id' => 'testid',
      'Review_Status__c' => 'test review status',
      'Comments__c' => 'test comment'
    }
  end
  let(:mock_domain_with_all_fields) do
    {
      'id' => 'testid',
      'review_status' => 'test review status',
      'comments' => 'test comment',
      'application' => {
        'id' => 'applicationid'
      },
      'primary_application_applicant_name' => 'James',
      'flagged_record' => {
        'rule_name' => 'test rule name',
        'listing' => nil
      }
    }
  end
  let(:mock_salesforce_with_all_fields) do
    {
      'Id' => 'testid',
      'Review_Status' => 'test review status',
      'Comments' => 'test comment',
      'Application' => {
        'Id' => 'applicationid'
      },
      'Primary_Application_Applicant_Name' => 'James',
      'Flagged_Record_Set' => {
        'Rule_Name' => 'test rule name',
        'Listing' => nil
      }
    }
  end
  let(:mock_salesforce_with_all_fields_with_suffix) do
    {
      'Id' => 'testid',
      'Review_Status__c' => 'test review status',
      'Comments__c' => 'test comment',
      'Application__c' => {
        'Id' => 'applicationid'
      },
      'Primary_Application_Applicant_Name__c' => 'James',
      'Flagged_Record_Set__c' => {
        'Rule_Name' => 'test rule name',
        'Listing' => nil
      }
    }
  end

  describe '#to_domain' do
    it 'should convert from salesforce fields to domain' do
      result = Force::FlaggedApplication.from_salesforce(mock_salesforce).to_domain
      expect(result).to eq(mock_domain)
    end

    it 'should convert from salesforce fields to domain when a record set is provided' do
      result = Force::FlaggedApplication.from_salesforce(mock_salesforce_with_all_fields).to_domain
      expect(result).to eq(mock_domain_with_all_fields)
    end
  end

  describe '#to_salesforce' do
    it 'should convert from domain fields to salesforce' do
      result = Force::FlaggedApplication.from_domain(mock_domain).to_salesforce
      expect(result).to eq(mock_salesforce)
    end

    it 'should convert from salesforce fields to domain when a record set is provided' do
      result = Force::FlaggedApplication.from_domain(mock_domain_with_all_fields).to_salesforce
      expect(result).to eq(mock_salesforce_with_all_fields)
    end
  end

  describe '#to_salesforce_with_suffix' do
    it 'should convert from domain fields to salesforce with suffix' do
      result = Force::FlaggedApplication.from_domain(mock_domain).to_salesforce_with_suffix
      expect(result).to eq(mock_salesforce_with_suffix)
    end

    it 'should convert from domain fields to salesforce with suffix' do
      result = Force::FlaggedApplication.from_domain(mock_domain_with_all_fields).to_salesforce_with_suffix
      expect(result).to eq(mock_salesforce_with_all_fields_with_suffix)
    end
  end
end
