# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::OpenHouse do
  let(:mock_domain) do
    {
      'date' => '2020-05-05',
      'end_time' => '12:00PM',
      'start_time' => '11:00AM'
    }
  end

  let(:mock_salesforce) do
    {
      'Date' => '2020-05-05',
      'End_Time' => '12:00PM',
      'Start_Time' => '11:00AM'
    }
  end

  describe '#to_domain' do
    it 'should convert from salesforce fields to domain' do
      result = Force::OpenHouse.from_salesforce(mock_salesforce).to_domain
      expect(result).to eq(mock_domain)
    end
  end

  describe '#to_salesforce' do
    it 'should convert from domain fields to salesforce' do
      result = Force::OpenHouse.from_domain(mock_domain).to_salesforce
      expect(result).to eq(mock_salesforce)
    end
  end
end
