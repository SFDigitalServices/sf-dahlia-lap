# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::FieldUpdateComment do
  let(:mock_domain) do
    {
      'application' => 'a0o0P00000IWHwjQAH',
      'comment' => 'test comment',
      'status' => 'Approved',
      'date' => '2020-05-28T20:13:19.000+0000',
      'substatus' => 'Approval letter sent',
      'timestamp' => 1590696799,
      'created_by' => 'User Name',
    }
  end
  let(:mock_salesforce) do
    {
      'Application' => 'a0o0P00000IWHwjQAH',
      'Processing_Comment' => 'test comment',
      'Processing_Status' => 'Approved',
      'Processing_Date_Updated' => '2020-05-28T20:13:19.000+0000',
      'Sub_Status' => 'Approval letter sent',
    }
  end
  let(:mock_salesforce_with_suffix) do
    {
      'Application__c' => 'a0o0P00000IWHwjQAH',
      'Processing_Comment__c' => 'test comment',
      'Processing_Status__c' => 'Approved',
      'Processing_Date_Updated__c' => '2020-05-28T20:13:19.000+0000',
      'Sub_Status__c' => 'Approval letter sent',
    }
  end

  describe '#to_domain' do
    it 'should convert from salesforce fields to domain' do
      mock_salesforce['CreatedBy'] = { 'Name': 'User Name' }
      result = Force::FieldUpdateComment.from_salesforce(mock_salesforce).to_domain
      expect(result).to eq(mock_domain)
    end
  end

  describe '#to_salesforce' do
    it 'should convert from domain fields to salesforce' do
      result = Force::FieldUpdateComment.from_domain(mock_domain).to_salesforce
      expect(result).to eq(mock_salesforce)
    end
  end

  describe '#to_salesforce_with_suffix' do
    it 'should convert from domain fields to salesforce with suffix' do
      result = Force::FieldUpdateComment.from_domain(mock_domain).to_salesforce_with_suffix
      expect(result).to eq(mock_salesforce_with_suffix)
    end
  end
end
