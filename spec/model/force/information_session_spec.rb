# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::InformationSession do
  let(:mock_domain) do
    {
      'city' => 'San Francisco',
      'date' => '2020-05-05',
      'end_time' => '12:00PM',
      'start_time' => '11:00AM',
      'street_address' => '123 Fake street',
      'venue' => 'Moscone'
    }
  end

  let(:mock_salesforce) do
    {
      'City' => 'San Francisco',
      'Date' => '2020-05-05',
      'End_Time' => '12:00PM',
      'Start_Time' => '11:00AM',
      'Street_Address' => '123 Fake street',
      'Venue' => 'Moscone'
    }
  end

  describe '#to_domain' do
    it 'should convert from salesforce fields to domain' do
      result = Force::InformationSession.from_salesforce(mock_salesforce).to_domain
      expect(result).to eq(mock_domain)
    end
  end

  describe '#to_salesforce' do
    it 'should convert from domain fields to salesforce' do
      result = Force::InformationSession.from_domain(mock_domain).to_salesforce
      expect(result).to eq(mock_salesforce)
    end
  end
end
